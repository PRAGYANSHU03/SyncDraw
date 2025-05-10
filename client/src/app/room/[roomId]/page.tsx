'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import RoomToolbar from '@/components/room/RoomToolbar'
import Canvas from '@/components/room/Canvas'
import { Button } from '@/components/ui/button'
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'

interface Point {
  x: number
  y: number
}

interface Line {
  id: string
  points: number[]
  color: string
  strokeWidth: number
  isSelected?: boolean
}

interface Shape {
  id: string
  type: 'rectangle' | 'circle' | 'triangle'
  x: number
  y: number
  width: number
  height: number
  color: string
  strokeWidth: number
  isSelected?: boolean
}

export default function Room() {
  const { roomId } = useParams()
  const [lines, setLines] = useState<Line[]>([])
  const [shapes, setShapes] = useState<Shape[]>([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentLine, setCurrentLine] = useState<Line | null>(null)
  const [currentShape, setCurrentShape] = useState<Shape | null>(null)
  const [tool, setTool] = useState<'select' | 'pencil' | 'eraser' | 'rectangle' | 'circle' | 'triangle'>('select')
  const [color, setColor] = useState('#000000')
  const [strokeWidth, setStrokeWidth] = useState(5)
  const [doc, setDoc] = useState<Y.Doc | null>(null)
  const [provider, setProvider] = useState<WebsocketProvider | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const yDoc = new Y.Doc()
    const yProvider = new WebsocketProvider(
      process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:1234',
      roomId as string,
      yDoc
    )

    const drawingArray = yDoc.getArray('drawing')
    const shapesArray = yDoc.getArray('shapes')

    drawingArray.observe((event) => {
      const newLines = drawingArray.toArray() as Line[]
      setLines(newLines)
    })

    shapesArray.observe((event) => {
      const newShapes = shapesArray.toArray() as Shape[]
      setShapes(newShapes)
    })

    setDoc(yDoc)
    setProvider(yProvider)

    return () => {
      yProvider.destroy()
      yDoc.destroy()
    }
  }, [roomId])

  const handleMouseDown = (e: any) => {
    if (tool === 'select') {
      const clickedOnEmpty = e.target === e.target.getStage()
      if (clickedOnEmpty) {
        setSelectedIds([])
        return
      }

      const id = e.target.id()
      if (id) {
        const newSelectedIds = selectedIds.includes(id)
          ? selectedIds.filter(selectedId => selectedId !== id)
          : [...selectedIds, id]
        setSelectedIds(newSelectedIds)
      }
      return
    }

    setIsDrawing(true)
    const pos = e.target.getStage().getPointerPosition()

    if (tool === 'pencil' || tool === 'eraser') {
      setCurrentLine({
        id: Date.now().toString(),
        points: [pos.x, pos.y],
        color: tool === 'eraser' ? 'rgba(0, 0, 0, 0)' : color,
        strokeWidth: tool === 'eraser' ? 30 : strokeWidth,
      })
    } else {
      setCurrentShape({
        id: Date.now().toString(),
        type: tool as 'rectangle' | 'circle' | 'triangle',
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        color: color,
        strokeWidth: strokeWidth,
      })
    }
  }

  const handleMouseMove = (e: any) => {
    if (!isDrawing) return

    const stage = e.target.getStage()
    const point = stage.getPointerPosition()

    if (tool === 'pencil' || tool === 'eraser') {
      const newLine = {
        ...currentLine!,
        points: [...currentLine!.points, point.x, point.y],
      }
      setCurrentLine(newLine)

      // If using eraser, check for intersections with existing lines and shapes
      if (tool === 'eraser' && doc) {
        const drawingArray = doc.getArray('drawing')
        const shapesArray = doc.getArray('shapes')
        
        // Check for line intersections
        const lines = drawingArray.toArray() as Line[]
        lines.forEach((line, index) => {
          if (isLineIntersecting(newLine, line)) {
            drawingArray.delete(index, 1)
          }
        })

        // Check for shape intersections
        const shapes = shapesArray.toArray() as Shape[]
        shapes.forEach((shape, index) => {
          if (isShapeIntersecting(newLine, shape)) {
            shapesArray.delete(index, 1)
          }
        })
      }
    } else if (currentShape) {
      const newShape = {
        ...currentShape,
        width: point.x - currentShape.x,
        height: point.y - currentShape.y,
      }
      setCurrentShape(newShape)
    }
  }

  // Helper function to check if two lines intersect
  const isLineIntersecting = (line1: Line, line2: Line) => {
    const points1 = line1.points
    const points2 = line2.points
    
    for (let i = 0; i < points1.length - 2; i += 2) {
      const x1 = points1[i]
      const y1 = points1[i + 1]
      const x2 = points1[i + 2]
      const y2 = points1[i + 3]
      
      for (let j = 0; j < points2.length - 2; j += 2) {
        const x3 = points2[j]
        const y3 = points2[j + 1]
        const x4 = points2[j + 2]
        const y4 = points2[j + 3]
        
        // Check if line segments intersect
        const denominator = ((y4 - y3) * (x2 - x1)) - ((x4 - x3) * (y2 - y1))
        if (denominator === 0) continue
        
        const ua = (((x4 - x3) * (y1 - y3)) - ((y4 - y3) * (x1 - x3))) / denominator
        const ub = (((x2 - x1) * (y1 - y3)) - ((y2 - y1) * (x1 - x3))) / denominator
        
        if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
          return true
        }
      }
    }
    return false
  }

  // Helper function to check if a line intersects with a shape
  const isShapeIntersecting = (line: Line, shape: Shape) => {
    const points = line.points
    const shapeBounds = {
      left: shape.x,
      right: shape.x + shape.width,
      top: shape.y,
      bottom: shape.y + shape.height
    }
    
    for (let i = 0; i < points.length - 2; i += 2) {
      const x1 = points[i]
      const y1 = points[i + 1]
      const x2 = points[i + 2]
      const y2 = points[i + 3]
      
      // Check if line segment intersects with shape bounds
      if (
        (x1 >= shapeBounds.left && x1 <= shapeBounds.right && y1 >= shapeBounds.top && y1 <= shapeBounds.bottom) ||
        (x2 >= shapeBounds.left && x2 <= shapeBounds.right && y2 >= shapeBounds.top && y2 <= shapeBounds.bottom)
      ) {
        return true
      }
    }
    return false
  }

  const handleMouseUp = () => {
    if (!isDrawing || !doc) return
    setIsDrawing(false)

    if (tool === 'pencil' || tool === 'eraser') {
      if (currentLine) {
        const drawingArray = doc.getArray('drawing')
        drawingArray.push([currentLine])
      }
      setCurrentLine(null)
    } else if (currentShape) {
      const shapesArray = doc.getArray('shapes')
      shapesArray.push([currentShape])
      setCurrentShape(null)
    }
  }

  const handleTransform = (e: any) => {
    if (!doc) return

    const node = e.target
    const scaleX = node.scaleX()
    const scaleY = node.scaleY()

    // Reset scale
    node.scaleX(1)
    node.scaleY(1)

    // Update shape or line
    if (node.className === 'Shape') {
      const shape = shapes.find(s => s.id === node.id())
      if (shape) {
        const shapesArray = doc.getArray('shapes')
        const index = shapesArray.toArray().findIndex((s: any) => s.id === shape.id)
        if (index !== -1) {
          shapesArray.delete(index, 1)
          shapesArray.insert(index, [{
            ...shape,
            x: node.x(),
            y: node.y(),
            width: node.width() * scaleX,
            height: node.height() * scaleY,
          }])
        }
      }
    } else if (node.className === 'Line') {
      const line = lines.find(l => l.id === node.id())
      if (line) {
        const drawingArray = doc.getArray('drawing')
        const index = drawingArray.toArray().findIndex((l: any) => l.id === line.id)
        if (index !== -1) {
          drawingArray.delete(index, 1)
          drawingArray.insert(index, [{
            ...line,
            points: node.points(),
          }])
        }
      }
    }
  }

  const handleClearAll = () => {
    if (!doc) return
    const drawingArray = doc.getArray('drawing')
    const shapesArray = doc.getArray('shapes')
    
    // Clear all drawings
    while (drawingArray.length > 0) {
      drawingArray.delete(0, 1)
    }
    
    // Clear all shapes
    while (shapesArray.length > 0) {
      shapesArray.delete(0, 1)
    }
    
    // Reset state
    setSelectedIds([])
    setCurrentLine(null)
    setCurrentShape(null)
    setIsDrawing(false)
  }

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
  }

  return (
    <div className="h-screen flex flex-col">
      <RoomToolbar
        tool={tool}
        setTool={setTool}
        color={color}
        setColor={setColor}
        strokeWidth={strokeWidth}
        setStrokeWidth={setStrokeWidth}
        onClearAll={handleClearAll}
        roomId={roomId as string}
      />
      <Canvas
        tool={tool}
        color={color}
        strokeWidth={strokeWidth}
        lines={lines}
        shapes={shapes}
        currentLine={currentLine}
        currentShape={currentShape}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTransform={handleTransform}
      />
    </div>
  )
}
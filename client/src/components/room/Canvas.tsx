import React, { useRef } from 'react'
import { Stage, Layer, Line, Rect, Circle, RegularPolygon, Transformer } from 'react-konva'
import Konva from 'konva'

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

interface CanvasProps {
  tool: 'select' | 'pencil' | 'eraser' | 'rectangle' | 'circle' | 'triangle'
  color: string
  strokeWidth: number
  lines: Line[]
  shapes: Shape[]
  currentLine: Line | null
  currentShape: Shape | null
  selectedIds: string[]
  setSelectedIds: (ids: string[] | ((prev: string[]) => string[])) => void
  onMouseDown: (e: any) => void
  onMouseMove: (e: any) => void
  onMouseUp: () => void
  onTransform: (e: any) => void
}

export default function Canvas({
  tool,
  color,
  strokeWidth,
  lines,
  shapes,
  currentLine,
  currentShape,
  selectedIds,
  setSelectedIds,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onTransform,
}: CanvasProps) {
  const transformerRef = useRef<any>(null)
  const stageRef = useRef<any>(null)

  React.useEffect(() => {
    if (transformerRef.current) {
      const nodes = selectedIds.map(id => {
        const shape = shapes.find(s => s.id === id)
        const line = lines.find(l => l.id === id)
        return shape || line
      }).filter(Boolean)

      // Get the actual Konva nodes from the stage
      const konvaNodes = nodes.map(node => {
        if (!node) return null
        const konvaNode = stageRef.current.findOne(`#${node.id}`)
        return konvaNode
      }).filter(Boolean)

      if (konvaNodes.length > 0) {
        transformerRef.current.nodes(konvaNodes)
        transformerRef.current.getLayer().batchDraw()
      } else {
        transformerRef.current.nodes([])
      }
    }
  }, [selectedIds, shapes, lines])

  const renderShape = (shape: Shape) => {
    const commonProps = {
      id: shape.id,
      x: shape.x,
      y: shape.y,
      width: shape.width,
      height: shape.height,
      stroke: shape.color,
      strokeWidth: shape.strokeWidth,
      fill: 'transparent',
      draggable: tool === 'select',
      onClick: (e: any) => {
        if (tool === 'select') {
          const id = e.target.id()
          setSelectedIds((prev: string[]) => 
            prev.includes(id) ? prev.filter((i: string) => i !== id) : [...prev, id]
          )
          e.cancelBubble = true
        }
      },
    }

    switch (shape.type) {
      case 'rectangle':
        return <Rect {...commonProps} />
      case 'circle':
        return <Circle {...commonProps} radius={Math.max(Math.abs(shape.width), Math.abs(shape.height)) / 2} />
      case 'triangle':
        return (
          <RegularPolygon
            {...commonProps}
            sides={3}
            x={shape.x + shape.width / 2}
            y={shape.y + shape.height / 2}
            radius={Math.max(Math.abs(shape.width), Math.abs(shape.height)) / 2}
          />
        )
    }
  }

  return (
    <div className="flex-1 bg-muted">
      <Stage
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight - 80}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        className="bg-background"
      >
        <Layer>
          {shapes.map((shape) => (
            <React.Fragment key={shape.id}>{renderShape(shape)}</React.Fragment>
          ))}
          {currentShape && renderShape(currentShape)}
          {lines.map((line) => (
            <Line
              key={line.id}
              id={line.id}
              points={line.points}
              stroke={line.color}
              strokeWidth={line.strokeWidth}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
              draggable={tool === 'select'}
              onClick={(e) => {
                if (tool === 'select') {
                  const id = e.target.id()
                  setSelectedIds((prev: string[]) => 
                    prev.includes(id) ? prev.filter((i: string) => i !== id) : [...prev, id]
                  )
                }
              }}
            />
          ))}
          {currentLine && (
            <Line
              points={currentLine.points}
              stroke={currentLine.color}
              strokeWidth={currentLine.strokeWidth}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
            />
          )}
          {tool === 'select' && (
            <Transformer
              ref={transformerRef}
              boundBoxFunc={(oldBox, newBox) => {
                const minSize = 5
                if (newBox.width < minSize || newBox.height < minSize) {
                  return oldBox
                }
                return newBox
              }}
              onTransform={onTransform}
              keepRatio={false}
              enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
            />
          )}
        </Layer>
      </Stage>
    </div>
  )
} 
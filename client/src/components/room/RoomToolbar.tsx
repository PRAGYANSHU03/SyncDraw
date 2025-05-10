import React from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '../ThemeProvider'
import { Button } from '../ui/button'

interface RoomToolbarProps {
  tool: 'select' | 'pencil' | 'eraser' | 'rectangle' | 'circle' | 'triangle'
  setTool: (tool: 'select' | 'pencil' | 'eraser' | 'rectangle' | 'circle' | 'triangle') => void
  color: string
  setColor: (color: string) => void
  strokeWidth: number
  setStrokeWidth: (width: number) => void
  onClearAll: () => void
  roomId: string
}

export default function RoomToolbar({
  tool,
  setTool,
  color,
  setColor,
  strokeWidth,
  setStrokeWidth,
  onClearAll,
  roomId,
}: RoomToolbarProps) {
  const [showShapes, setShowShapes] = React.useState(false)
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()

  const handleExitRoom = () => {
    router.push('/')
  }

  return (
    <div className="bg-background/80 backdrop-blur-sm border-b p-4 flex items-center justify-between">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-semibold text-foreground">Room:</h1>
          <span className="px-2 py-1 bg-primary/10 text-primary rounded-md font-mono">{roomId}</span>
        </div>
        
        <div className="h-6 w-px bg-border" />
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setTool('select')}
            title="Select"
            className={`text-foreground flex items-center gap-2 ${tool === 'select' ? 'border-primary' : ''}`}
          >
            <span className="material-icons">select_all</span>
            <span>Select</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => setTool('pencil')}
            className={`text-foreground flex items-center gap-2 ${tool === 'pencil' ? 'border-primary' : ''}`}
            title="Draw"
          >
            <span className="material-icons">edit</span>
            <span>Draw</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => setTool('eraser')}
            className={`text-foreground flex items-center gap-2 ${tool === 'eraser' ? 'border-primary' : ''}`}
            title="Eraser"
          >
            <span className="material-icons">format_color_reset</span>
            <span>Eraser</span>
          </Button>
        </div>

        <div className="h-6 w-px bg-border" />

        <div className="relative">
          <Button
            variant="outline"
            onClick={() => setShowShapes(!showShapes)}
            className={`text-foreground flex items-center gap-2 ${['rectangle', 'circle', 'triangle'].includes(tool) ? 'border-primary' : ''}`}
            title="Shapes"
          >
            <span className="material-icons">shapes</span>
            <span>Shapes</span>
          </Button>
          {showShapes && (
            <div className="absolute top-full left-0 mt-1 bg-popover text-popover-foreground rounded-md shadow-lg border py-1 z-10">
              <Button
                variant="ghost"
                className={`w-full justify-start text-foreground ${tool === 'rectangle' ? 'bg-accent' : ''}`}
                onClick={() => {
                  setTool('rectangle')
                  setShowShapes(false)
                }}
              >
                <span className="material-icons mr-2">rectangle</span>
                Rectangle
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start text-foreground ${tool === 'circle' ? 'bg-accent' : ''}`}
                onClick={() => {
                  setTool('circle')
                  setShowShapes(false)
                }}
              >
                <span className="material-icons mr-2">circle</span>
                Circle
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start text-foreground ${tool === 'triangle' ? 'bg-accent' : ''}`}
                onClick={() => {
                  setTool('triangle')
                  setShowShapes(false)
                }}
              >
                <span className="material-icons mr-2">change_history</span>
                Triangle
              </Button>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-border" />

        <div className="flex items-center space-x-4">
          {tool === 'pencil' && (
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border border-border"
                title="Color"
              />
            </div>
          )}
          <div className="flex items-center space-x-2">
            <span className="material-icons text-foreground/60">line_weight</span>
            <input
              type="range"
              min="1"
              max="20"
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(Number(e.target.value))}
              className="w-32 bg-background text-foreground"
              title="Stroke Width"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          onClick={toggleTheme}
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          className="text-foreground flex items-center gap-2"
        >
          <span className="material-icons">
            {theme === 'light' ? 'dark_mode' : 'light_mode'}
          </span>
          <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
        </Button>
        <Button
          variant="destructive"
          onClick={onClearAll}
          title="Clear All"
          className="text-foreground flex items-center gap-2"
        >
          <span className="material-icons">delete</span>
          <span>Clear</span>
        </Button>
        <Button
          variant="outline"
          onClick={handleExitRoom}
          title="Exit Room"
          className="text-foreground flex items-center gap-2"
        >
          <span className="material-icons">logout</span>
          <span>Exit</span>
        </Button>
      </div>
    </div>
  )
} 
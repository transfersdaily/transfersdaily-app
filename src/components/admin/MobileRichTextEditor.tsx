"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link, 
  Image, 
  Quote,
  Undo,
  Redo,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight
} from "lucide-react"
import { useIsMobile, adminMobileClasses, adminMobileTouchTargets } from "@/lib/mobile-utils"

interface MobileRichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
  minHeight?: string
}

export function MobileRichTextEditor({ 
  content, 
  onChange, 
  placeholder = "Start writing your article...",
  className = "",
  minHeight = "300px"
}: MobileRichTextEditorProps) {
  const isMobile = useIsMobile()
  const editorRef = useRef<HTMLDivElement>(null)
  const [isToolbarVisible, setIsToolbarVisible] = useState(true)

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const insertLink = () => {
    const url = prompt('Enter URL:')
    if (url) {
      executeCommand('createLink', url)
    }
  }

  const insertImage = () => {
    const url = prompt('Enter image URL:')
    if (url) {
      executeCommand('insertImage', url)
    }
  }

  const toolbarButtons = [
    { icon: Bold, command: 'bold', label: 'Bold' },
    { icon: Italic, command: 'italic', label: 'Italic' },
    { icon: Underline, command: 'underline', label: 'Underline' },
    { type: 'separator' },
    { icon: List, command: 'insertUnorderedList', label: 'Bullet List' },
    { icon: ListOrdered, command: 'insertOrderedList', label: 'Numbered List' },
    { type: 'separator' },
    { icon: AlignLeft, command: 'justifyLeft', label: 'Align Left' },
    { icon: AlignCenter, command: 'justifyCenter', label: 'Align Center' },
    { icon: AlignRight, command: 'justifyRight', label: 'Align Right' },
    { type: 'separator' },
    { icon: Link, action: insertLink, label: 'Insert Link' },
    { icon: Image, action: insertImage, label: 'Insert Image' },
    { icon: Quote, command: 'formatBlock', value: 'blockquote', label: 'Quote' },
  ]

  const MobileToolbar = () => (
    <div className={`border-b bg-background ${isToolbarVisible ? 'block' : 'hidden'}`}>
      <div className="p-2 flex flex-wrap gap-1 overflow-x-auto">
        {toolbarButtons.map((button, index) => {
          if (button.type === 'separator') {
            return <Separator key={index} orientation="vertical" className="mx-1 h-8" />
          }
          
          const Icon = button.icon!
          return (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              className={`${adminMobileTouchTargets.button} min-w-[44px] h-[44px] p-2`}
              onClick={() => {
                if (button.action) {
                  button.action()
                } else {
                  executeCommand(button.command!, button.value)
                }
              }}
              title={button.label}
            >
              <Icon className="w-4 h-4" />
            </Button>
          )
        })}
      </div>
      
      {/* Mobile toolbar toggle */}
      <div className={`${adminMobileClasses.mobileOnly} text-center py-2 border-t`}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsToolbarVisible(!isToolbarVisible)}
          className="text-xs"
        >
          {isToolbarVisible ? 'Hide Toolbar' : 'Show Toolbar'}
        </Button>
      </div>
    </div>
  )

  const DesktopToolbar = () => (
    <div className="border-b p-2 flex gap-1 overflow-x-auto">
      {toolbarButtons.map((button, index) => {
        if (button.type === 'separator') {
          return <Separator key={index} orientation="vertical" className="mx-1" />
        }
        
        const Icon = button.icon!
        return (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => {
              if (button.action) {
                button.action()
              } else {
                executeCommand(button.command!, button.value)
              }
            }}
            title={button.label}
          >
            <Icon className="w-4 h-4" />
          </Button>
        )
      })}
    </div>
  )

  return (
    <div className={`border rounded-lg overflow-hidden ${className}`}>
      {/* Responsive Toolbar */}
      {isMobile ? <MobileToolbar /> : <DesktopToolbar />}
      
      {/* Editor Area */}
      <div 
        ref={editorRef}
        contentEditable
        className={`p-4 outline-none focus:ring-0 overflow-y-auto ${isMobile ? 'text-base' : 'text-sm'}`}
        style={{ minHeight }}
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: content }}
        data-placeholder={placeholder}
      />
      
      {/* Mobile-specific styles */}
      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        
        [contenteditable] {
          line-height: 1.6;
        }
        
        [contenteditable] h1 {
          font-size: 1.5rem;
          font-weight: bold;
          margin: 1rem 0;
        }
        
        [contenteditable] h2 {
          font-size: 1.25rem;
          font-weight: bold;
          margin: 0.75rem 0;
        }
        
        [contenteditable] h3 {
          font-size: 1.125rem;
          font-weight: bold;
          margin: 0.5rem 0;
        }
        
        [contenteditable] p {
          margin: 0.5rem 0;
        }
        
        [contenteditable] ul, [contenteditable] ol {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
        }
        
        [contenteditable] blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: #6b7280;
        }
        
        [contenteditable] img {
          max-width: 100%;
          height: auto;
          border-radius: 0.375rem;
          margin: 0.5rem 0;
        }
        
        [contenteditable] a {
          color: #3b82f6;
          text-decoration: underline;
        }
      `}</style>
    </div>
  )
}

'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Quote, 
  Link,
  Image,
  Undo,
  Redo,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
}

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Start writing...",
  minHeight = 300 
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
    updateWordCount();
  }, [value]);

  const updateWordCount = () => {
    if (editorRef.current) {
      const text = editorRef.current.innerText || '';
      const words = text.trim().split(/\s+/).filter(word => word.length > 0);
      setWordCount(words.length);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
      updateWordCount();
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      execCommand('insertImage', url);
    }
  };

  const formatBlock = (tag: string) => {
    execCommand('formatBlock', tag);
  };

  const toolbarButtons = [
    { icon: Bold, command: 'bold', title: 'Bold' },
    { icon: Italic, command: 'italic', title: 'Italic' },
    { icon: Underline, command: 'underline', title: 'Underline' },
  ];

  const alignButtons = [
    { icon: AlignLeft, command: 'justifyLeft', title: 'Align Left' },
    { icon: AlignCenter, command: 'justifyCenter', title: 'Align Center' },
    { icon: AlignRight, command: 'justifyRight', title: 'Align Right' },
  ];

  const listButtons = [
    { icon: List, command: 'insertUnorderedList', title: 'Bullet List' },
    { icon: ListOrdered, command: 'insertOrderedList', title: 'Numbered List' },
  ];

  return (
    <Card>
      <CardContent className="p-0">
        {/* Toolbar */}
        <div className="border-b p-3">
          <div className="flex items-center gap-1 flex-wrap">
            {/* Text Formatting */}
            <div className="flex items-center gap-1">
              {toolbarButtons.map(({ icon: Icon, command, title }) => (
                <Button
                  key={command}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => execCommand(command)}
                  title={title}
                  className="h-8 w-8 p-0"
                >
                  <Icon className="h-4 w-4" />
                </Button>
              ))}
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Alignment */}
            <div className="flex items-center gap-1">
              {alignButtons.map(({ icon: Icon, command, title }) => (
                <Button
                  key={command}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => execCommand(command)}
                  title={title}
                  className="h-8 w-8 p-0"
                >
                  <Icon className="h-4 w-4" />
                </Button>
              ))}
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Lists */}
            <div className="flex items-center gap-1">
              {listButtons.map(({ icon: Icon, command, title }) => (
                <Button
                  key={command}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => execCommand(command)}
                  title={title}
                  className="h-8 w-8 p-0"
                >
                  <Icon className="h-4 w-4" />
                </Button>
              ))}
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Insert */}
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={insertLink}
                title="Insert Link"
                className="h-8 w-8 p-0"
              >
                <Link className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={insertImage}
                title="Insert Image"
                className="h-8 w-8 p-0"
              >
                <Image className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => execCommand('insertHorizontalRule')}
                title="Insert Divider"
                className="h-8 w-8 p-0"
              >
                —
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Block Formatting */}
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => formatBlock('h2')}
                title="Heading 2"
                className="h-8 px-2 text-xs font-semibold"
              >
                H2
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => formatBlock('h3')}
                title="Heading 3"
                className="h-8 px-2 text-xs font-semibold"
              >
                H3
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => formatBlock('p')}
                title="Paragraph"
                className="h-8 px-2 text-xs"
              >
                P
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => execCommand('formatBlock', 'blockquote')}
                title="Quote"
                className="h-8 w-8 p-0"
              >
                <Quote className="h-4 w-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Undo/Redo */}
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => execCommand('undo')}
                title="Undo"
                className="h-8 w-8 p-0"
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => execCommand('redo')}
                title="Redo"
                className="h-8 w-8 p-0"
              >
                <Redo className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="relative">
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            className="prose max-w-none p-4 focus:outline-none"
            style={{ minHeight }}
            data-placeholder={placeholder}
            suppressContentEditableWarning={true}
          />
          
          {/* Placeholder */}
          {!value && (
            <div 
              className="absolute top-4 left-4 text-muted-foreground pointer-events-none"
              style={{ display: editorRef.current?.innerText ? 'none' : 'block' }}
            >
              {placeholder}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-4 py-2 flex justify-between items-center text-sm text-muted-foreground">
          <span>Word count: {wordCount}</span>
          <span>Rich text editor</span>
        </div>
      </CardContent>

      <style jsx>{`
        .prose h2 {
          font-size: 1.5em;
          font-weight: 600;
          margin: 1em 0 0.5em 0;
        }
        .prose h3 {
          font-size: 1.25em;
          font-weight: 600;
          margin: 1em 0 0.5em 0;
        }
        .prose p {
          margin: 0.5em 0;
          line-height: 1.6;
        }
        .prose blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1em;
          margin: 1em 0;
          font-style: italic;
          color: #6b7280;
        }
        .prose ul, .prose ol {
          margin: 0.5em 0;
          padding-left: 2em;
        }
        .prose li {
          margin: 0.25em 0;
        }
        .prose a {
          color: #3b82f6;
          text-decoration: underline;
        }
        .prose img {
          max-width: 100%;
          height: auto;
          margin: 1em 0;
          border-radius: 0.5rem;
        }
        .prose hr {
          margin: 2em 0;
          border: none;
          border-top: 1px solid #e5e7eb;
        }
      `}</style>
    </Card>
  );
}
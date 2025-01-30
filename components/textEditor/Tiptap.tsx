'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Heading from '@tiptap/extension-heading'
import Strike from '@tiptap/extension-strike'
import { cn } from '@/lib/utils'
import { AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, Italic, ListCollapse, ListOrdered, Strikethrough, UnderlineIcon } from 'lucide-react'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import OrderedList from '@tiptap/extension-ordered-list'
import { Level } from '@tiptap/extension-heading';
import { useEffect } from 'react'



interface TiptapProps {
  onChange: (content: string) => void
  content?: string
}

const Tiptap = ({ onChange, content }: TiptapProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Strike,
      Document,
      Paragraph,
      Text,
      Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      OrderedList
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none',
      }
    },
    content: content || '<p>Hello World! 🌎️</p>',
  })

  useEffect(() => {
    if (editor) {
      editor.on('update', () => {
        const content = editor.getHTML()
        onChange(content)
      })
    }
  }, [editor, onChange])

  if (!editor) {
    return null
  }

  return (
    <div className='border-2 min-h-96' >
      <div className="toolbar w-full space-x-2 md:space-x-4 p-2 border-b-2 sticky top-0 bg-white z-50">
        <select
          aria-label="Heading Level"
          name="level"
          id="level"
          onChange={(e) => {
            const level = parseInt(e.target.value, 10);
            editor.chain().focus().toggleHeading({ level: level as Level }).run();
          }}
          className="p-1 md:p-2 text-xs md:text-lg rounded-md border bg-white text-gray-800 cursor-pointer "
          value={
            [1, 2, 3, 4, 5, 6].find((level) => editor.isActive('heading', { level })) || ''
          }
        >
          <option value="" disabled>
            Select Heading
          </option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
          <option value="4">Heading 4</option>
          <option value="5">Heading 5</option>
          <option value="6">Heading 6</option>
        </select>
        <button type='button' role="none" onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()}
          className={cn('p-1 md:p-2 rounded-md', editor.isActive('bold') ? 'bg-slate-600 text-white' : '')}>
          <Bold className='w-4 h-4 md:w-6 md:h-6' />
        </button>
        <button type='button' role="none" onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={cn('p-1 md:p-2 rounded-md', editor.isActive('italic') ? 'bg-slate-600 text-white' : '')}>
          <Italic className='w-4 h-4 md:w-6 md:h-6' />
        </button>
        <button
          type="button"
          aria-label='Underline'
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={cn('p-1 md:p-2 rounded-md', editor.isActive('underline') ? 'bg-slate-600 text-white' : '')}
        >
          <UnderlineIcon className='w-4 h-4 md:w-6 md:h-6' />
        </button>
        <button type='button' role="none" onClick={() => editor.chain().focus().toggleStrike().run()} disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={cn('p-1 md:p-2 rounded-md', editor.isActive('strike') ? 'bg-slate-600 text-white' : '')}>
          <Strikethrough className='w-4 h-4 md:w-6 md:h-6' />
        </button>
        <button
          type='button'
          aria-label='Bullet list'
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn('p-1 md:p-2 rounded-md', editor.isActive('bulletList') ? 'bg-slate-600 text-white' : '')}
        >
          <ListCollapse className='w-4 h-4 md:w-6 md:h-6' />
        </button>
        <button
          type="button"
          aria-label='Order list'
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn('p-1 md:p-2 rounded-md', editor.isActive('orderedList') ? 'bg-slate-600 text-white' : '')}
        >
          <ListOrdered className='w-4 h-4 md:w-6 md:h-6' />
        </button>
        <button
          type="button"
          aria-label='Align left'
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={cn('p-1 md:p-2 rounded-md', editor.isActive({ textAlign: 'left' }) ? 'bg-slate-600 text-white' : '')}
        >
          <AlignLeft className='w-4 h-4 md:w-6 md:h-6' />
        </button>
        <button
          type='button'
          aria-label='Align center'
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={cn('p-1 md:p-2 rounded-md', editor.isActive({ textAlign: 'center' }) ? 'bg-slate-600 text-white' : '')}
        >
          <AlignCenter className='w-4 h-4 md:w-6 md:h-6' />
        </button>
        <button
          aria-label='Align right'
          type='button'
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={cn('p-1 md:p-2 rounded-md', editor.isActive({ textAlign: 'right' }) ? 'bg-slate-600 text-white' : '')}
        >
          <AlignRight className='w-4 h-4 md:w-6 md:h-6' />
        </button>
        <button
          aria-label='Align justify'
          type='button'
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={cn('p-1 md:p-2 rounded-md', editor.isActive({ textAlign: 'justify' }) ? 'bg-slate-600 text-white' : '')}
        >
          <AlignJustify className='w-4 h-4 md:w-6 md:h-6' />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}

export default Tiptap

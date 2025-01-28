'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import React, { useActionState, useState } from 'react';
import imageExample from '@/public/images/image-example-for-create-blog.webp'
import { blogCategories } from '@/lib/constants';
import dynamic from 'next/dynamic';
const Tiptap = dynamic(() => import('@/components/textEditor/Tiptap'), { ssr: false })
import { Button } from '@/components/ui/button';
import { createBlog } from '@/lib/actions';
import { LoaderCircle } from 'lucide-react';





export function CreateBlogForm() {
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [category, setCategory] = useState('')
  const [file, setFile] = useState<File>()
  const [content, setContent] = useState('')
  const handleContentChange = (newContent: string) => {
    setContent(newContent)
  }
  const [imagePreview, setImagePreview] = useState<string>()
  const [data, action, isPending] = useActionState(createBlog, undefined)

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  if (isPending && imagePreview) {
    setImagePreview('')
  }

  return (
    <form className='space-y-4 w-full' action={action}>
      <Label>Title</Label>
      <Input
        id='title'
        name='title'
        type='text'
        required
        minLength={5}
        onChange={(e) => setTitle(e.target.value)}
        defaultValue={title}
      />
      <Label>Subtitle</Label>
      <Input
        id='subtitle'
        name='subtitle'
        type='text'
        required
        minLength={5}
        onChange={(e) => setSubtitle(e.target.value)}
        defaultValue={subtitle}
      />
      <Label>Image</Label>
      <hr />
      <div className='max-w-2xl mx-auto relative p-1'>
        <Image
          src={imagePreview || imageExample}
          alt={`Image Preview`}
          width={300}
          height={170}
          sizes='(max-width: 768px) 75vw, (max-width: 1200px) 33vw, 22vw'
          className="rounded-lg object-cover w-full aspect-video"
        />
      </div>
      <hr />
      <Input
        id='image'
        name='image'
        type='file'
        onChange={handleImageChange}
        required
        defaultValue={file ? file.name : ''}
      />
      <select
        onChange={(e) => setCategory(e.target.value)}
        defaultValue={category}
        name="category" id="category" title='category'
        className='w-full border-2  p-2 rounded-md'
      >
        {blogCategories.map((category, i) => (
          <option key={i} value={category}>
            {category}
          </option>
        ))}
      </select>
      <br />
      <Label>Content</Label>
      <textarea hidden id='content' name='content' defaultValue={content} />
      <Tiptap onChange={handleContentChange} />
      {data && data.success === false && (
        isPending ? (
          <LoaderCircle className='animate-spin h-6 w-6 mx-auto mt-4' />
        ) : (
          <p className='bg-red-500 p-1 rounded-md'>{data.message}</p>
        )
      )}
      <Button
        type='submit'
        className='w-full'
        variant='default'
      >
        {isPending ? (
          <LoaderCircle className='animate-spin h-6 w-6 mx-auto' />
        ) : 'Create Blog'}
      </Button>

    </form >
  )
}

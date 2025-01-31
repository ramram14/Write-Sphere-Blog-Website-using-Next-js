'use client'
import Tiptap from '@/components/textEditor/Tiptap'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { editBlog } from '@/lib/action/blog.action'
import { blogCategories } from '@/lib/constants'
import { blogData } from '@/lib/types'
import { Label } from '@radix-ui/react-label'
import { LoaderCircle } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useActionState, useEffect, useState } from 'react'

export default function EditBlogForm({
  blog,
  slug
}: {
  blog: blogData,
  slug: string
}) {
  const [title, setTitle] = useState(blog?.title)
  const [subtitle, setSubtitle] = useState(blog?.subtitle)
  const [category, setCategory] = useState(blog?.category)
  const [file, setFile] = useState<File>()
  const [content, setContent] = useState(blog?.content)
  const [imagePreview, setImagePreview] = useState<string>()
  const [data, action, isPending] = useActionState(editBlog, undefined)
  const router = useRouter()

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
  }

  // Image Preview when user change their images
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }


  // If success, redirect to blog
  useEffect(() => {
    if (data) {
      if (data.success) {
        router.replace(`/${data.data?.slug}`);
      }
    }
    // If pending, remove image preview this is because when user send the form the image file in input will autmoatically gone, we remove the preview so thats no misunderstanding
    if (isPending && imagePreview) {
      setImagePreview('')
    }

  }, [isPending, imagePreview, data, router])

  return (
    <form className='space-y-4 w-full pb-[10rem]' action={action}>
      <input type="text" hidden id='slug' name='slug' required defaultValue={slug} />
      <Label>Title</Label>
      <Input
        id='title'
        name='title'
        type='text'
        placeholder='The Importance of Clean Code in Software Development'
        minLength={5}
        onChange={(e) => setTitle(e.target.value)}
        defaultValue={title}
      />
      <Label>Subtitle</Label>
      <Input
        id='subtitle'
        name='subtitle'
        type='text'
        placeholder='How Writing Readable and Maintainable Code Leads to Long-Term Success'
        minLength={5}
        onChange={(e) => setSubtitle(e.target.value)}
        defaultValue={subtitle}
      />
      <Label>Image</Label>
      <hr />
      <div className='max-w-2xl mx-auto relative p-1'>
        <Image
          src={imagePreview || blog?.image}
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
      <Tiptap content={blog?.content} onChange={handleContentChange} />
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
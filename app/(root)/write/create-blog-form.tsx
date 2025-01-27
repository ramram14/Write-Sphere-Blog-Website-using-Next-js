'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import imageExample from '@/public/images/image-example-for-create-blog.webp'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { blogCategories } from '@/lib/constants';




export function CreateBlogForm() {

  return (
    <form className='space-y-4'>
      <Label>Title</Label>
      <Input
        id='title'
        name='title'
        type='text'
        required
        minLength={5}
      />
      <Label>Title</Label>
      <Input
        id='subtitle'
        name='subtitle'
        type='text'
        required
        minLength={5}
        maxLength={30}
      />
      <ImageInput />
      <Label>Category</Label>
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue id='category' placeholder="Select your blog Category" />
        </SelectTrigger>
        <SelectContent>
          {blogCategories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Label>Content</Label>

    </form>
  )
}


function ImageInput() {
  const [fileImage, setFileImage] = useState<File>()
  const [imagePreview, setImagePreview] = useState<string>()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFileImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }
  return (
    <>
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
        onChange={handleChange}
        required
      />
    </>
  )
}
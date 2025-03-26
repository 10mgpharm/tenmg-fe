import { Button, FormControl, FormErrorMessage, FormLabel, Input, Spinner, Text, Textarea } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { MutipleFileUpload } from './MultipleFileUpload';
import { TrashIcon } from '@heroicons/react/20/solid';
import { useSession } from 'next-auth/react';
import { NextAuthUserSession } from '@/types';
import requestClient from '@/lib/requestClient';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';



interface IReviewForm {
  name: string;
  email: string;
  review: string;
  product: string;
}

export default function ReviewForm({ onClose, prod_id, prod_name }: any) {

  const session = useSession();
  const userData = session.data as NextAuthUserSession;

  const formSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    comment: z.string().min(5, "Comment must be at least 5 characters"),
    productId: z.string().nonempty("Product ID is required"),
  });

  // console.log('user', userData)

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: userData?.user?.name,
      email: userData?.user?.email,
      comment: "",
      productId: prod_id,
    },
  })



  // const [filePreview, setFilePreview] = useState<string[]>([]);
  // const [file, setFile] = useState<File[]>([]);
  // const [fileError, setFileError] = useState<string>(null);
  const [loading, setLoading] = useState(false);
  // const toast = useToast();

  const onSubmit = async (data) => {
    // console.log(data);
    setLoading(true);
    try {
      const res = await requestClient({ token: userData?.user?.token }).post(
        "/storefront/reviews", data);
      setLoading(false);
      onClose();
      toast.success("Review posted successfully")
      window.location.reload();
      // console.log(res)
    } catch (e) {
      setLoading(false);
      // console.log(e)
      toast.error(e.response.data.message || "Failed to post review")
    }
  }

  return (
    <div>

      <form onSubmit={handleSubmit(onSubmit)}>

        <FormControl isInvalid={!!errors.name} >
          <FormLabel htmlFor="name">
            Your Name
          </FormLabel>
          <Input
            id="name"
            placeholder="eg. John Doe"
            // disabled
            {...register("name", {
              required: "Your Name is required",
            })}
          />
          <FormErrorMessage>
            {errors.name?.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.email}>
          <FormLabel htmlFor="email">
            Email
          </FormLabel>
          <Input
            id="email"
            // disabled
            placeholder="eg. johndoe@mail.com"
            {...register("email", {
              required: "Business Name is required",
            })}
          />
          <FormErrorMessage>
            {errors.email?.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl >
          <FormLabel htmlFor="product">
            Product
          </FormLabel>
          <Input
            id="product"
            placeholder="Enter your business product"
            disabled
            value={prod_name}
          // {...register("product", {
          //   required: "Business Name is required",
          // })}
          />
          <FormErrorMessage>
            {/* {errors.product?.message} */}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.comment}>
          <FormLabel htmlFor="comment">
            Review
          </FormLabel>
          <Textarea
            id="review"
            placeholder="Write your Comment here"
            {...register("comment", {
              required: "review is required",
            })}
          />
          <FormErrorMessage>
            {errors.comment?.message}
          </FormErrorMessage>
        </FormControl>


        {/* <div className="flex flex-col justify-between gap-3 my-3">
          <Text fontSize={"1rem"} fontWeight={600} color="gray.700">Upload Pictures (Maximum number of images - 6 )</Text>

          <div className='flex items-center gap-x-2'>
            {filePreview?.map((preview, i) => (
              <div key={i} className='relative size-16 bg-no-repeat group bg-cover bg-center border border-gray-400 rounded-lg' style={{ backgroundImage: `url(${preview})` }}>
                <div className='absolute -top-1 left-0 bg-gray-500/70 w-fit h-fit '>
                  <TrashIcon className=' text-red-600 size-4' onClick={() => setFilePreview(filePreview.filter((_, index) => index !== i))} />
                </div>
              </div>
            ))
            }
            <MutipleFileUpload
              setFilePreview={setFilePreview}
              filePreview={filePreview}
              setFile={setFile}
              setFileError={setFileError}
              file={file}
              count={6}
            />
          </div>
          {fileError && <p className="text-xs text-red-500">{fileError}</p>}

        </div> */}

        <div className='flex flex-row-reverse w-full my-4'>
          <Button variant={"outline"} colorScheme={'blue'} size={'sm'} disabled={loading} type="submit">{loading ? <Spinner /> : "Post Review"}</Button>
        </div>
      </form>
    </div>
  )
}

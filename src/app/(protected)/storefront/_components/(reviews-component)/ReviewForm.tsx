import { Button, FormControl, FormErrorMessage, FormLabel, Input, Text, Textarea } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { MutipleFileUpload } from './MultipleFileUpload';
import { TrashIcon } from '@heroicons/react/20/solid';



interface IReviewForm {
  name: string;
  email: string;
  review: string;
  product: string;
}

export default function ReviewForm({ onClose }: any) {


  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      review: "",
      product: "",
    },
  })



  const [filePreview, setFilePreview] = useState<string[]>([]);
  const [file, setFile] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string>(null);
  // const toast = useToast();

  return (
    <div>

      <form>

        <FormControl isInvalid={!!errors.name}>
          <FormLabel htmlFor="name">
            Your Name
          </FormLabel>
          <Input
            id="name"
            placeholder="eg. John Doe"
            disabled
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
            placeholder="eg. johndoe@mail.com"
            {...register("email", {
              required: "Business Name is required",
            })}
          />
          <FormErrorMessage>
            {errors.email?.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.product}>
          <FormLabel htmlFor="product">
            Product
          </FormLabel>
          <Input
            id="product"
            placeholder="Enter your business product"
            disabled
            {...register("product", {
              required: "Business Name is required",
            })}
          />
          <FormErrorMessage>
            {errors.product?.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.review}>
          <FormLabel htmlFor="review">
            Review
          </FormLabel>
          <Textarea
            id="review"
            placeholder="Write your review here"
            {...register("review", {
              required: "review is required",
            })}
          />
          <FormErrorMessage>
            {errors.review?.message}
          </FormErrorMessage>
        </FormControl>


        <div className="flex flex-col justify-between gap-3 my-3">
          <Text fontSize={"1rem"} fontWeight={600} color="gray.700">Upload Pictures (Maximum number of images - 6 )</Text>
          {/* <Text fontSize={"14px"} fontWeight={400} color="gray.700">Upload Pictures (MaximumE number of images - 6 )</Text> */}

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

        </div>

        <div className='flex flex-row-reverse w-full my-4'>
          <Button onClick={onClose} variant={"outline"} colorScheme={'blue'} size={'sm'}>Post Review</Button>
        </div>
      </form>
    </div>
  )
}

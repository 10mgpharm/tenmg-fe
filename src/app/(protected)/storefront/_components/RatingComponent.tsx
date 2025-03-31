'use client'
import React from 'react'
import { StarRating } from "react-flexible-star-rating";

interface IRatingComponent {
  rating: number
  handleRating?: (rate: number) => void
  readonly?: boolean

}
export default function RatingComponent({ handleRating, readonly, rating, }: IRatingComponent) {
  return (
    <div className="w-full flex items-center" >
      <StarRating
        initialRating={rating > 0 ? Math.round(rating) : 0}
        onRatingChange={handleRating}
        starsLength={5}
        dimension={6}
        isReadOnly={readonly}
      />
    </div>
  )
}

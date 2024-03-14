// services/reviewService.js

import Review from '../models/Review';

const reviewService = {
  createReview: async (reviewData) => {
    try {
      const review = await Review.create(reviewData);
      return review;
    } catch (error) {
      throw new Error('Error creating review: ' + error.message);
    }
  },

  getReviewById: async (reviewId) => {
    try {
      const review = await Review.findByPk(reviewId);
      return review;
    } catch (error) {
      throw new Error('Error fetching review: ' + error.message);
    }
  },

  // Add more functions as needed
};

export default reviewService;

export default function () {
  return {
    news: [],
    new: {},
    responseMessages: [],
    status: false,
    userSelectedReview: localStorage.getItem('userSelectedReview') ? parseInt(localStorage.getItem('userSelectedReview'), 10) : 0,
    sectorSelectedReview: localStorage.getItem('sectorSelectedReview') ? JSON.parse(localStorage.getItem('sectorSelectedReview')) : [],
  };
}

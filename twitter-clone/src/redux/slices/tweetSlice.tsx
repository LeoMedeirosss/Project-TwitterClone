// manages tweet feed and interactions
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Tweet {
  id: number;
  user_id: number;
  username: string;
  content: string;
  created_at: string;
  likes: number;
  likedByMe?: boolean; //indicates if the current user liked the tweet
}

interface TweetState {
  feed: Tweet[]; //list of tweets displayed in the timeline
}

const initialState: TweetState = {
  feed: [],
};

// slice to handle tweet-related actions
const tweetSlice = createSlice({
  name: "tweets",
  initialState,
  reducers: {
    setFeed: (
      state,
      action: PayloadAction<Tweet[]>
    ) => {
      state.feed = action.payload;
    },
    addTweet: ( //adds a new tweet at the top of the feed
      state,
      action: PayloadAction<Tweet>
    ) => {
      state.feed.unshift(action.payload);
    },
    toggleLike: (
      state,
      action: PayloadAction<number>
    ) => {
      const tweet = state.feed.find((t) => t.id === action.payload);
      if (tweet) {
        tweet.likedByMe = !tweet.likedByMe;
        tweet.likes += tweet.likedByMe ? 1 : -1;
      }
    },
  },
});

export const { setFeed, addTweet, toggleLike } = tweetSlice.actions;
export default tweetSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchConversations = createAsyncThunk(
  'chat/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/chat/conversations');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch conversations');
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/chat/conversations/${conversationId}/messages`);
      return { conversationId, messages: response.data.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch messages');
    }
  }
);

export const createConversation = createAsyncThunk(
  'chat/createConversation',
  async (conversationData, { rejectWithValue }) => {
    try {
      const response = await api.post('/chat/conversations', conversationData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to initialize conversation');
    }
  }
);

const initialState = {
  conversations: [],
  messages: [],
  currentConversationId: null,
  loading: false,
  error: null
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    selectConversation: (state, action) => {
      state.currentConversationId = action.payload;
    },
    messageReceived: (state, action) => {
      const message = action.payload;
      
      // If the incoming message belongs to the current open conversation thread, append it
      if (state.currentConversationId === message.conversationId) {
        state.messages.push(message);
      }

      // Update the last message preview in conversations list
      const convIndex = state.conversations.findIndex(c => c.conversationId === message.conversationId);
      if (convIndex !== -1) {
        const conversation = state.conversations[convIndex];
        conversation.lastMessagePreview = message.content;
        conversation.lastMessageAt = message.createdAt;
        
        // If thread is not open, increment unread count for current user
        if (state.currentConversationId !== message.conversationId) {
          // Determine which participant index corresponds to current user (assumes frontend will check user profile)
          // Simple increment logic (can be fine-tuned in components)
          if (conversation.participant1Id === message.receiverId) {
            conversation.unreadCount1 += 1;
          } else {
            conversation.unreadCount2 += 1;
          }
        }
        
        // Move conversation to top of list
        state.conversations.splice(convIndex, 1);
        state.conversations.unshift(conversation);
      }
    },
    clearMessages: (state) => {
      state.messages = [];
      state.currentConversationId = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Conversations
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Messages
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload.messages;
        state.currentConversationId = action.payload.conversationId;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Conversation
      .addCase(createConversation.fulfilled, (state, action) => {
        const exists = state.conversations.some(c => c.conversationId === action.payload.conversationId);
        if (!exists) {
          state.conversations.unshift(action.payload);
        }
      });
  }
});

export const { selectConversation, messageReceived, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;

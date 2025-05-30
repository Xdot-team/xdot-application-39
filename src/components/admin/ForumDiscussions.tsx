import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, MessageSquare, ThumbsUp, Reply } from 'lucide-react';
import { mockForumPosts } from '@/data/mockAdminData';
import { ForumPost, ForumReply } from '@/data/mockAdminData';
import { toast } from '@/components/ui/sonner';

export function ForumDiscussions() {
  const [posts, setPosts] = useState<ForumPost[]>(mockForumPosts);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState<string>('general');
  const [newReplyContent, setNewReplyContent] = useState('');
  const [replyingToPost, setReplyingToPost] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Mock current user for demonstration
  const currentUser = { id: '1', name: 'Demo User' };

  // Filter posts by category and search query
  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesQuery = 
      searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    const newPost: ForumPost = {
      id: `post_${Date.now()}`,
      title: newPostTitle,
      content: newPostContent,
      authorId: currentUser?.id || '1',
      authorName: currentUser?.name || 'Anonymous',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: [],
      category: newPostCategory as any,
      tags: [],
      replies: []
    };

    setPosts([newPost, ...posts]);
    setNewPostTitle('');
    setNewPostContent('');
    setDialogOpen(false);
    toast.success("Post created successfully");
  };

  const handleAddReply = (postId: string) => {
    if (!newReplyContent.trim()) {
      toast.error("Please enter a reply");
      return;
    }

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const newReply: ForumReply = {
          id: `reply_${Date.now()}`,
          content: newReplyContent,
          authorId: currentUser?.id || '1',
          authorName: currentUser?.name || 'Anonymous',
          createdAt: new Date().toISOString(),
          likes: []
        };
        return {
          ...post,
          replies: [...post.replies, newReply]
        };
      }
      return post;
    });

    setPosts(updatedPosts);
    setNewReplyContent('');
    setReplyingToPost(null);
    toast.success("Reply added");
  };

  const handleLikePost = (postId: string) => {
    if (!currentUser) return;

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const userLikedIndex = post.likes.indexOf(currentUser.id);
        if (userLikedIndex >= 0) {
          // User already liked, remove like
          const updatedLikes = [...post.likes];
          updatedLikes.splice(userLikedIndex, 1);
          return { ...post, likes: updatedLikes };
        } else {
          // Add like
          return { ...post, likes: [...post.likes, currentUser.id] };
        }
      }
      return post;
    });

    setPosts(updatedPosts);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'announcements': return 'bg-blue-500 hover:bg-blue-600';
      case 'safety': return 'bg-red-500 hover:bg-red-600';
      case 'technical': return 'bg-purple-500 hover:bg-purple-600';
      case 'field': return 'bg-green-500 hover:bg-green-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>Community Forum</CardTitle>
              <CardDescription>
                Connect and collaborate with team members across departments
              </CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  New Post
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Post</DialogTitle>
                  <DialogDescription>
                    Share information, ask questions, or start a discussion
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <Input
                    placeholder="Post Title"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                  />
                  <Textarea
                    placeholder="Write your post here..."
                    rows={5}
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Category</label>
                      <select
                        className="w-full border rounded-md p-2"
                        value={newPostCategory}
                        onChange={(e) => setNewPostCategory(e.target.value)}
                      >
                        <option value="general">General</option>
                        <option value="announcements">Announcements</option>
                        <option value="technical">Technical</option>
                        <option value="field">Field</option>
                        <option value="safety">Safety</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-4 mt-4">
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreatePost}>Create Post</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Tabs defaultValue="all" onValueChange={setSelectedCategory}>
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="announcements">Announcements</TabsTrigger>
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="technical">Technical</TabsTrigger>
                  <TabsTrigger value="field">Field</TabsTrigger>
                  <TabsTrigger value="safety">Safety</TabsTrigger>
                </TabsList>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </Tabs>
          </div>

          <div className="space-y-6">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <div key={post.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{post.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <span>{post.authorName}</span>
                        <span>•</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        <Badge variant="secondary" className={`ml-2 text-white ${getCategoryColor(post.category)}`}>
                          {post.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleLikePost(post.id)}
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {post.likes.length}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-sm">
                    <p>{post.content}</p>
                  </div>
                  
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="outline">#{tag}</Badge>
                      ))}
                    </div>
                  )}
                  
                  {post.replies.length > 0 && (
                    <div className="mt-6 space-y-4 pl-4 border-l-2">
                      {post.replies.map((reply) => (
                        <div key={reply.id} className="bg-gray-50 rounded-md p-3">
                          <div className="flex justify-between">
                            <div className="text-sm font-medium">{reply.authorName}</div>
                            <div className="text-xs text-muted-foreground">{new Date(reply.createdAt).toLocaleString()}</div>
                          </div>
                          <p className="text-sm mt-1">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {replyingToPost === post.id ? (
                    <div className="mt-4">
                      <Textarea
                        placeholder="Write your reply..."
                        value={newReplyContent}
                        onChange={(e) => setNewReplyContent(e.target.value)}
                        className="mb-2"
                      />
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => setReplyingToPost(null)}>
                          Cancel
                        </Button>
                        <Button size="sm" onClick={() => handleAddReply(post.id)}>
                          Reply
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-4"
                      onClick={() => setReplyingToPost(post.id)}
                    >
                      <Reply className="h-4 w-4 mr-1" />
                      Reply
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <h3 className="font-medium">No posts found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

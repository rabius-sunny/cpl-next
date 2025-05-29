'use client'

import TinymceSimple from '@/components/shared/TinymceSimple'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEffect, useState } from 'react'

export default function TinymceExample() {
  const [isMounted, setIsMounted] = useState(false)
  const [content, setContent] = useState(`
    <h1>Welcome to TinyMCE!</h1>
    <p>This is a <strong>comprehensive rich text editor</strong> with advanced features including:</p>
    <ul>
      <li>Rich text formatting with <em>bold</em>, <u>underline</u>, and <code>code</code></li>
      <li>Tables, images, and media embedding</li>
      <li>Code syntax highlighting</li>
      <li>Templates and quick insertion tools</li>
      <li>Advanced typography and layout options</li>
    </ul>
    
    <h2>Try These Features:</h2>
    <ol>
      <li>Select text to see the quick formatting toolbar</li>
      <li>Use the template buttons above to insert pre-made content</li>
      <li>Insert tables, images, and other media</li>
      <li>Use keyboard shortcuts like <strong>Ctrl+B</strong> for bold</li>
    </ol>
    
    <blockquote>
      <p>"TinyMCE provides the ultimate flexibility for content creation with its extensive plugin ecosystem and customization options."</p>
    </blockquote>
    
    <h3>Code Example:</h3>
    <pre class="language-javascript"><code>function hello() {
  console.log("Hello from TinyMCE!");
}</code></pre>
  `)

  const [title, setTitle] = useState('My Document')
  const [author, setAuthor] = useState('')
  const [category, setCategory] = useState('General')

  // Ensure component only renders on client side
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleSave = () => {
    const document = {
      title,
      author,
      category,
      content,
      createdAt: new Date().toISOString(),
      wordCount: content
        .replace(/<[^>]*>/g, '')
        .split(/\s+/)
        .filter((word) => word.length > 0).length
    }

    console.log('Saved document:', document)
    alert('Document saved successfully!')
  }

  const handleReset = () => {
    setContent('')
    setTitle('My Document')
    setAuthor('')
    setCategory('General')
  }

  const presetContents = {
    article: `
      <h1>Article Title</h1>
      <p><em>By ${author || 'Author Name'} - ${new Date().toLocaleDateString()}</em></p>
      
      <h2>Introduction</h2>
      <p>Start your article with an engaging introduction that hooks the reader...</p>
      
      <h2>Main Points</h2>
      <ul>
        <li>First main point with supporting details</li>
        <li>Second main point with examples</li>
        <li>Third main point with evidence</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>Summarize your key points and provide a compelling conclusion...</p>
    `,

    meeting: `
      <h1>Meeting Notes</h1>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;"><strong>Date:</strong></td>
          <td style="border: 1px solid #ddd; padding: 8px;">${new Date().toLocaleDateString()}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;"><strong>Attendees:</strong></td>
          <td style="border: 1px solid #ddd; padding: 8px;">List attendees here</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;"><strong>Duration:</strong></td>
          <td style="border: 1px solid #ddd; padding: 8px;">1 hour</td>
        </tr>
      </table>
      
      <h2>Agenda</h2>
      <ol>
        <li>Agenda item 1</li>
        <li>Agenda item 2</li>
        <li>Agenda item 3</li>
      </ol>
      
      <h2>Discussion Points</h2>
      <p>Record key discussion points here...</p>
      
      <h2>Action Items</h2>
      <ul>
        <li><strong>Action:</strong> Description [Assigned to: Name] [Due: Date]</li>
        <li><strong>Action:</strong> Description [Assigned to: Name] [Due: Date]</li>
      </ul>
    `,

    product: `
      <h1>Product Name</h1>
      
      <h2>Product Overview</h2>
      <p>Provide a compelling overview of your product that highlights its value proposition...</p>
      
      <h2>Key Features</h2>
      <ul>
        <li><strong>Feature 1:</strong> Detailed description of the feature</li>
        <li><strong>Feature 2:</strong> Detailed description of the feature</li>
        <li><strong>Feature 3:</strong> Detailed description of the feature</li>
      </ul>
      
      <h2>Technical Specifications</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f8f9fa;">
            <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Specification</th>
            <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Dimensions</td>
            <td style="border: 1px solid #ddd; padding: 8px;">Length x Width x Height</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Weight</td>
            <td style="border: 1px solid #ddd; padding: 8px;">Weight in kg/lbs</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Material</td>
            <td style="border: 1px solid #ddd; padding: 8px;">Primary materials used</td>
          </tr>
        </tbody>
      </table>
      
      <h2>Benefits</h2>
      <blockquote>
        <p>Highlight the main benefits and competitive advantages of your product.</p>
      </blockquote>
    `
  }

  return (
    <div className='max-w-7xl mx-auto p-6 space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl'>TinyMCE Rich Text Editor Demo</CardTitle>
          <CardDescription>
            Experience the full power of TinyMCE with all features enabled including templates,
            media handling, tables, code highlighting, and advanced formatting options.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue='editor' className='space-y-4'>
            <TabsList className='grid w-full grid-cols-4'>
              <TabsTrigger value='editor'>Editor</TabsTrigger>
              <TabsTrigger value='settings'>Document Settings</TabsTrigger>
              <TabsTrigger value='templates'>Quick Templates</TabsTrigger>
              <TabsTrigger value='preview'>Preview</TabsTrigger>
            </TabsList>

            <TabsContent value='editor' className='space-y-4'>
              <TinymceSimple
                value={content}
                onChange={setContent}
                height={600}
                placeholder='Start creating amazing content...'
                className='w-full'
                menubar={true}
                statusbar={true}
              />
            </TabsContent>

            <TabsContent value='settings' className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='title'>Document Title</Label>
                  <Input
                    id='title'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder='Enter document title'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='author'>Author</Label>
                  <Input
                    id='author'
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder='Enter author name'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='category'>Category</Label>
                  <Input
                    id='category'
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder='Enter category'
                  />
                </div>

                <div className='space-y-2'>
                  <Label>Document Stats</Label>
                  <div className='flex gap-2'>
                    <Badge variant='outline'>
                      {
                        content
                          .replace(/<[^>]*>/g, '')
                          .split(/\s+/)
                          .filter((word) => word.length > 0).length
                      }{' '}
                      words
                    </Badge>
                    <Badge variant='outline'>
                      {content.replace(/<[^>]*>/g, '').length} characters
                    </Badge>
                  </div>
                </div>
              </div>

              <div className='flex gap-2 pt-4'>
                <Button onClick={handleSave}>Save Document</Button>
                <Button variant='outline' onClick={handleReset}>
                  Reset All
                </Button>
              </div>
            </TabsContent>

            <TabsContent value='templates' className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <Card
                  className='cursor-pointer hover:shadow-md transition-shadow'
                  onClick={() => setContent(presetContents.article)}
                >
                  <CardHeader>
                    <CardTitle className='text-lg'>Article Template</CardTitle>
                    <CardDescription>
                      Perfect for blog posts, news articles, and editorial content
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge>Click to load</Badge>
                  </CardContent>
                </Card>

                <Card
                  className='cursor-pointer hover:shadow-md transition-shadow'
                  onClick={() => setContent(presetContents.meeting)}
                >
                  <CardHeader>
                    <CardTitle className='text-lg'>Meeting Notes</CardTitle>
                    <CardDescription>
                      Structured template for meeting documentation and action items
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge>Click to load</Badge>
                  </CardContent>
                </Card>

                <Card
                  className='cursor-pointer hover:shadow-md transition-shadow'
                  onClick={() => setContent(presetContents.product)}
                >
                  <CardHeader>
                    <CardTitle className='text-lg'>Product Description</CardTitle>
                    <CardDescription>
                      Comprehensive template for product specifications and features
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge>Click to load</Badge>
                  </CardContent>
                </Card>
              </div>

              <div className='mt-6 p-4 bg-blue-50 rounded-lg'>
                <h3 className='font-semibold text-blue-900 mb-2'>Template Features:</h3>
                <ul className='text-blue-800 space-y-1 text-sm'>
                  <li>• Pre-formatted structure for consistent content</li>
                  <li>• Placeholder text to guide content creation</li>
                  <li>• Professional styling and layout</li>
                  <li>• Customizable to fit your specific needs</li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value='preview' className='space-y-4'>
              <Card>
                <CardHeader>
                  <CardTitle>{title}</CardTitle>
                  {author && (
                    <CardDescription>
                      By {author} • {category}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div
                    className='prose prose-lg max-w-none'
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Feature Showcase */}
      <Card>
        <CardHeader>
          <CardTitle>TinyMCE Features Included</CardTitle>
          <CardDescription>
            This implementation includes all major TinyMCE features and plugins
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <div className='space-y-2'>
              <h4 className='font-semibold'>Formatting</h4>
              <div className='text-sm text-gray-600 space-y-1'>
                <div>• Bold, Italic, Underline</div>
                <div>• Fonts & Colors</div>
                <div>• Alignment & Spacing</div>
                <div>• Lists & Indentation</div>
              </div>
            </div>

            <div className='space-y-2'>
              <h4 className='font-semibold'>Content</h4>
              <div className='text-sm text-gray-600 space-y-1'>
                <div>• Tables & Charts</div>
                <div>• Images & Media</div>
                <div>• Links & Anchors</div>
                <div>• Templates</div>
              </div>
            </div>

            <div className='space-y-2'>
              <h4 className='font-semibold'>Advanced</h4>
              <div className='text-sm text-gray-600 space-y-1'>
                <div>• Code Highlighting</div>
                <div>• Spell Check</div>
                <div>• Word Count</div>
                <div>• Fullscreen Mode</div>
              </div>
            </div>

            <div className='space-y-2'>
              <h4 className='font-semibold'>Productivity</h4>
              <div className='text-sm text-gray-600 space-y-1'>
                <div>• Quick Toolbars</div>
                <div>• Keyboard Shortcuts</div>
                <div>• Auto-save</div>
                <div>• Export Options</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

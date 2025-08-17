import React, { useState, useEffect } from 'react';
import './App.css';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Input } from './components/ui/input';
import { Textarea } from './components/ui/textarea';
import { Badge } from './components/ui/badge';
import { Rocket, Atom, Database, Brain, MessageCircle, Users, Target, ChevronRight, Star, Globe, Zap } from 'lucide-react';
import axios from 'axios';

function App() {
  const [chatMessages, setChatMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [researchData, setResearchData] = useState([]);
  const [newResearch, setNewResearch] = useState({
    title: '',
    category: 'space',
    description: '',
    findings: ''
  });

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  useEffect(() => {
    fetchResearchData();
  }, []);

  const fetchResearchData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/research`);
      setResearchData(response.data);
    } catch (error) {
      console.error('Error fetching research data:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;

    const userMessage = { role: 'user', content: currentMessage };
    setChatMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${backendUrl}/api/chat`, {
        message: currentMessage
      });
      
      const aiMessage = { role: 'assistant', content: response.data.response };
      setChatMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddResearch = async () => {
    try {
      await axios.post(`${backendUrl}/api/research`, newResearch);
      setNewResearch({ title: '', category: 'space', description: '', findings: '' });
      fetchResearchData();
    } catch (error) {
      console.error('Error adding research:', error);
    }
  };

  const handleDeleteResearch = async (id) => {
    try {
      await axios.delete(`${backendUrl}/api/research/${id}`);
      fetchResearchData();
    } catch (error) {
      console.error('Error deleting research:', error);
    }
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <nav className="nav-container">
          <div className="logo">
            <Rocket className="w-8 h-8 text-cyan-400" />
            <span className="logo-text">ShanCorp</span>
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#research">Research</a>
            <a href="#ai-demo">AI Demo</a>
            <Button className="cta-button">Get Started</Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <Badge className="hero-badge">🚀 Future of Space & Quantum Technology</Badge>
            <h1 className="hero-title">
              Pioneering the Next Frontier of
              <span className="gradient-text"> Space Research</span> &
              <span className="gradient-text"> Quantum Computing</span>
            </h1>
            <p className="hero-description">
              We're building the future where space exploration meets quantum theory and AI programming. 
              Join us in revolutionizing research, database management, and technological advancement 
              for scientists, researchers, and innovators worldwide.
            </p>
            <div className="hero-buttons">
              <Button size="lg" className="primary-button">
                <Rocket className="w-5 h-5 mr-2" />
                Explore Research
              </Button>
              <Button size="lg" variant="outline" className="secondary-button">
                <MessageCircle className="w-5 h-5 mr-2" />
                Try AI Demo
              </Button>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <Star className="w-6 h-6 text-yellow-400" />
                <span>Cutting-edge Research</span>
              </div>
              <div className="stat">
                <Globe className="w-6 h-6 text-blue-400" />
                <span>Global Impact</span>
              </div>
              <div className="stat">
                <Zap className="w-6 h-6 text-purple-400" />
                <span>AI-Powered</span>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <img 
              src="https://images.unsplash.com/photo-1447433865958-f402f562b843?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxzcGFjZSUyMHRlY2hub2xvZ3l8ZW58MHx8fHwxNzU1NDI5NDU0fDA&ixlib=rb-4.1.0&q=85"
              alt="Space Technology"
              className="hero-main-image"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Core Focus Areas</h2>
            <p className="section-description">
              Integrating space research, quantum theory, and AI programming to create groundbreaking solutions
            </p>
          </div>
          
          <div className="features-grid">
            <Card className="feature-card">
              <CardHeader>
                <div className="feature-icon">
                  <Rocket className="w-12 h-12 text-cyan-400" />
                </div>
                <CardTitle>Space Research Programs</CardTitle>
                <CardDescription>
                  Advanced space exploration research and satellite technology development
                </CardDescription>
              </CardHeader>
              <CardContent>
                <img 
                  src="https://images.unsplash.com/photo-1526666923127-b2970f64b422?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwyfHxzcGFjZSUyMHRlY2hub2xvZ3l8ZW58MHx8fHwxNzU1NDI5NDU0fDA&ixlib=rb-4.1.0&q=85"
                  alt="Radio Telescopes"
                  className="feature-image"
                />
                <ul className="feature-list">
                  <li>• Satellite technology advancement</li>
                  <li>• Deep space exploration missions</li>
                  <li>• Astronomical data analysis</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardHeader>
                <div className="feature-icon">
                  <Atom className="w-12 h-12 text-purple-400" />
                </div>
                <CardTitle>Quantum Theory & Computing</CardTitle>
                <CardDescription>
                  Quantum computing research and theoretical physics applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <img 
                  src="https://images.unsplash.com/photo-1617839625591-e5a789593135?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwxfHxxdWFudHVtJTIwY29tcHV0aW5nfGVufDB8fHx8MTc1NTQyOTQ4OHww&ixlib=rb-4.1.0&q=85"
                  alt="Quantum Computing"
                  className="feature-image"
                />
                <ul className="feature-list">
                  <li>• Quantum algorithm development</li>
                  <li>• Quantum entanglement research</li>
                  <li>• Quantum cryptography solutions</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardHeader>
                <div className="feature-icon">
                  <Brain className="w-12 h-12 text-green-400" />
                </div>
                <CardTitle>AI Programming & Analysis</CardTitle>
                <CardDescription>
                  Artificial intelligence for space and quantum research analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <img 
                  src="https://images.unsplash.com/photo-1681583484651-281ae2defb17?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwxfHxhaSUyMHByb2dyYW1taW5nfGVufDB8fHx8MTc1NTQyOTQ5M3ww&ixlib=rb-4.1.0&q=85"
                  alt="AI Programming"
                  className="feature-image"
                />
                <ul className="feature-list">
                  <li>• Machine learning models</li>
                  <li>• Predictive analysis systems</li>
                  <li>• Automated research tools</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardHeader>
                <div className="feature-icon">
                  <Database className="w-12 h-12 text-orange-400" />
                </div>
                <CardTitle>Research Database Management</CardTitle>
                <CardDescription>
                  Advanced database systems for storing and analyzing research data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <img 
                  src="https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg"
                  alt="Database Technology"
                  className="feature-image"
                />
                <ul className="feature-list">
                  <li>• Scalable data storage solutions</li>
                  <li>• Real-time data processing</li>
                  <li>• Advanced analytics dashboards</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Interactive Tabs Section */}
      <section className="interactive-section">
        <div className="container">
          <h2 className="section-title">Interactive Platform</h2>
          <Tabs defaultValue="ai-demo" className="platform-tabs">
            <TabsList className="tabs-list">
              <TabsTrigger value="ai-demo" className="tab-trigger">
                <MessageCircle className="w-5 h-5 mr-2" />
                AI Demo
              </TabsTrigger>
              <TabsTrigger value="research" className="tab-trigger">
                <Database className="w-5 h-5 mr-2" />
                Research Database
              </TabsTrigger>
              <TabsTrigger value="about" className="tab-trigger">
                <Users className="w-5 h-5 mr-2" />
                About Us
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ai-demo" className="tab-content">
              <Card className="demo-card">
                <CardHeader>
                  <CardTitle>AI Assistant - Space & Quantum Expert</CardTitle>
                  <CardDescription>
                    Ask me anything about space research, quantum theory, or AI programming!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="chat-container">
                    <div className="chat-messages">
                      {chatMessages.length === 0 && (
                        <div className="welcome-message">
                          <p>👋 Hello! I'm your AI assistant specialized in space research and quantum theory. Ask me anything!</p>
                          <div className="suggested-questions">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setCurrentMessage("Explain quantum entanglement in simple terms")}
                            >
                              Explain quantum entanglement
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setCurrentMessage("What are the latest developments in space research?")}
                            >
                              Latest space research
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setCurrentMessage("How does AI help in quantum computing?")}
                            >
                              AI in quantum computing
                            </Button>
                          </div>
                        </div>
                      )}
                      {chatMessages.map((message, index) => (
                        <div key={index} className={`message ${message.role}`}>
                          <div className="message-content">
                            {message.content}
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="message assistant">
                          <div className="message-content loading">
                            <div className="loading-dots">
                              <span></span>
                              <span></span>
                              <span></span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="chat-input">
                      <Input
                        placeholder="Ask about space research, quantum theory, or AI..."
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        disabled={isLoading}
                      />
                      <Button 
                        onClick={handleSendMessage}
                        disabled={isLoading || !currentMessage.trim()}
                        className="send-button"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="research" className="tab-content">
              <div className="research-section">
                <Card className="add-research-card">
                  <CardHeader>
                    <CardTitle>Add New Research</CardTitle>
                    <CardDescription>Contribute to our research database</CardDescription>
                  </CardHeader>
                  <CardContent className="research-form">
                    <Input
                      placeholder="Research Title"
                      value={newResearch.title}
                      onChange={(e) => setNewResearch({...newResearch, title: e.target.value})}
                    />
                    <select 
                      value={newResearch.category}
                      onChange={(e) => setNewResearch({...newResearch, category: e.target.value})}
                      className="category-select"
                    >
                      <option value="space">Space Research</option>
                      <option value="quantum">Quantum Theory</option>
                      <option value="ai">AI Programming</option>
                      <option value="database">Database Technology</option>
                    </select>
                    <Textarea
                      placeholder="Description"
                      value={newResearch.description}
                      onChange={(e) => setNewResearch({...newResearch, description: e.target.value})}
                    />
                    <Textarea
                      placeholder="Key Findings"
                      value={newResearch.findings}
                      onChange={(e) => setNewResearch({...newResearch, findings: e.target.value})}
                    />
                    <Button onClick={handleAddResearch} className="add-button">
                      <Database className="w-4 h-4 mr-2" />
                      Add Research
                    </Button>
                  </CardContent>
                </Card>

                <div className="research-grid">
                  {researchData.map((research) => (
                    <Card key={research.id} className="research-card">
                      <CardHeader>
                        <div className="research-header">
                          <Badge variant="secondary" className={`category-badge ${research.category}`}>
                            {research.category}
                          </Badge>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteResearch(research.id)}
                          >
                            Delete
                          </Button>
                        </div>
                        <CardTitle className="research-title">{research.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="research-description">{research.description}</p>
                        <div className="research-findings">
                          <h4>Key Findings:</h4>
                          <p>{research.findings}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="about" className="tab-content">
              <Card className="about-card">
                <CardHeader>
                  <CardTitle>About QuantumSpace</CardTitle>
                  <CardDescription>Pioneering the future of space research and quantum technology</CardDescription>
                </CardHeader>
                <CardContent className="about-content">
                  <div className="about-grid">
                    <div className="about-section">
                      <h3>Our Mission</h3>
                      <p>
                        We're dedicated to advancing the frontiers of space research and quantum theory through 
                        innovative AI programming and advanced database management systems. Our goal is to make 
                        cutting-edge research accessible to scientists, researchers, and innovators worldwide.
                      </p>
                    </div>
                    <div className="about-section">
                      <h3>Who We Serve</h3>
                      <div className="audience-tags">
                        <Badge><Users className="w-4 h-4 mr-1" />Investors</Badge>
                        <Badge><Brain className="w-4 h-4 mr-1" />Researchers</Badge>
                        <Badge><Globe className="w-4 h-4 mr-1" />General Public</Badge>
                        <Badge><Target className="w-4 h-4 mr-1" />Scientists</Badge>
                      </div>
                    </div>
                    <div className="about-section">
                      <h3>Technology Stack</h3>
                      <ul>
                        <li>• Advanced AI/ML models for research analysis</li>
                        <li>• Quantum computing simulations</li>
                        <li>• Real-time database management systems</li>
                        <li>• Space mission planning software</li>
                      </ul>
                    </div>
                    <div className="about-section">
                      <h3>Future Vision</h3>
                      <p>
                        As we prepare to launch, we envision a future where space exploration and quantum 
                        computing revolutionize how we understand the universe. Join us on this incredible journey.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <Rocket className="w-8 h-8 text-cyan-400" />
                <span>QuantumSpace</span>
              </div>
              <p>Pioneering the future of space research and quantum technology</p>
            </div>
            <div className="footer-section">
              <h4>Research Areas</h4>
              <ul>
                <li>Space Technology</li>
                <li>Quantum Computing</li>
                <li>AI Programming</li>
                <li>Database Systems</li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Community</h4>
              <ul>
                <li>Researchers</li>
                <li>Scientists</li>
                <li>Investors</li>
                <li>Innovators</li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <p>Coming Soon...</p>
              <p>Stay tuned for updates!</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 QuantumSpace. All rights reserved. Building the future of space and quantum research.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
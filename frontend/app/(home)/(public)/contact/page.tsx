"use client";

import type React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  Clock,
  Github,
  HelpCircle,
  Linkedin,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  Twitter,
} from "lucide-react";
import { useState } from "react";

const contactMethods = [
  {
    icon: Mail,
    title: "Email Support",
    description: "Get help from our support team",
    contact: "support@promptcraft.ai",
    availability: "24/7 response within 4 hours",
  },
  {
    icon: MessageSquare,
    title: "Live Chat",
    description: "Chat with us in real-time",
    contact: "Available in app",
    availability: "Mon-Fri, 9AM-6PM PST",
  },
  {
    icon: Phone,
    title: "Phone Support",
    description: "Speak directly with our team",
    contact: "+1 (555) 123-4567",
    availability: "Enterprise customers only",
  },
];

const offices = [
  {
    city: "University of Science",
    address: "227 Nguyen Van Cu, District 5",
    zipCode: "Ho Chi Minh City, VN 50001",
    phone: "+1 (555) 123-4567",
    email: "sf@promptcraft.ai",
  },
  // {
  //   city: "New York",
  //   address: "456 Tech Avenue, Floor 12",
  //   zipCode: "New York, NY 10001",
  //   phone: "+1 (555) 987-6543",
  //   email: "ny@promptcraft.ai",
  // },
  // {
  //   city: "London",
  //   address: "789 AI Street, Level 8",
  //   zipCode: "London, UK EC2A 4DP",
  //   phone: "+44 20 1234 5678",
  //   email: "london@promptcraft.ai",
  // },
];

const inquiryTypes = [
  { value: "general", label: "General Inquiry" },
  { value: "support", label: "Technical Support" },
  { value: "sales", label: "Sales & Pricing" },
  { value: "partnership", label: "Partnership" },
  { value: "press", label: "Press & Media" },
  { value: "careers", label: "Careers" },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    inquiryType: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 2000);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      company: "",
      inquiryType: "",
      subject: "",
      message: "",
    });
    setIsSubmitted(false);
  };

  return (
    <div className="min-h-screen">
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions about PromptCraft? We&apos;re here to help. Reach out
            and we&apos;ll get back to you shortly.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Contact Methods */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            How Can We Help?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {contactMethods.map(
              (
                { icon: Icon, title, description, contact, availability },
                i,
              ) => (
                <Card
                  key={i}
                  className="text-center hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium mb-2">{contact}</p>
                    <Badge variant="outline" className="text-xs">
                      {availability}
                    </Badge>
                  </CardContent>
                </Card>
              ),
            )}
          </div>
        </section>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>
                Fill out the form and we&apos;ll reply within 24 hours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground">
                    Thank you for reaching out. We&apos;ll be in touch soon.
                  </p>
                  <Button className="mt-4" onClick={resetForm}>
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleChange("company", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="inquiryType">Inquiry Type *</Label>
                    <Select
                      value={formData.inquiryType}
                      onValueChange={(val) => handleChange("inquiryType", val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select inquiry type" />
                      </SelectTrigger>
                      <SelectContent>
                        {inquiryTypes.map(({ value, label }) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleChange("subject", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      rows={6}
                      value={formData.message}
                      onChange={(e) => handleChange("message", e.target.value)}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" /> Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Right Sidebar: Offices, Hours, Social, FAQ */}
          <div className="space-y-6">
            {/* Offices */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" /> Our Offices
                </CardTitle>
                <CardDescription>
                  Visit us at one of our locations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {offices.map(({ city, address, zipCode, phone, email }, i) => (
                  <div
                    key={i}
                    className="border-b pb-4 last:border-0 last:pb-0"
                  >
                    <h3 className="font-semibold mb-2">{city}</h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>{address}</p>
                      <p>{zipCode}</p>
                      <p className="flex items-center gap-2">
                        <Phone className="h-3 w-3" /> {phone}
                      </p>
                      <p className="flex items-center gap-2">
                        <Mail className="h-3 w-3" /> {email}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" /> Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Mon - Fri</span>
                  <span className="font-medium">9:00 AM - 6:00 PM PST</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-medium">10:00 AM - 4:00 PM PST</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-medium">Closed</span>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-muted-foreground">
                    <strong>Email Support:</strong> 24/7 within 4 hours
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Social */}
            <Card>
              <CardHeader>
                <CardTitle>Follow Us</CardTitle>
                <CardDescription>
                  Stay connected on social media
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-4">
                {[Twitter, Linkedin, Github].map((Icon, i) => (
                  <Button key={i} variant="outline" size="icon" asChild>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <Icon className="h-4 w-4" />
                    </a>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" /> Need Quick Answers?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Check our FAQ for help with common issues.
                </p>
                <Button variant="outline" className="w-full bg-transparent">
                  View FAQ
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  Lock,
  Eye,
  Users,
  Database,
  Globe,
  Mail,
  FileText,
  Calendar,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

const sections = [
  {
    id: "information-collection",
    title: "Information We Collect",
    icon: Database,
  },
  { id: "information-use", title: "How We Use Information", icon: Eye },
  { id: "information-sharing", title: "Information Sharing", icon: Users },
  { id: "data-security", title: "Data Security", icon: Lock },
  { id: "cookies", title: "Cookies & Tracking", icon: Globe },
  { id: "user-rights", title: "Your Rights", icon: Shield },
  { id: "data-retention", title: "Data Retention", icon: Calendar },
  { id: "international", title: "International Transfers", icon: Globe },
  { id: "children", title: "Children's Privacy", icon: Users },
  { id: "changes", title: "Policy Changes", icon: FileText },
  { id: "contact", title: "Contact Us", icon: Mail },
];

const dataTypes = [
  {
    category: "Account Information",
    description: "Name, email address, password, profile information",
    purpose: "Account creation and management",
    retention: "Until account deletion",
  },
  {
    category: "Usage Data",
    description: "Prompts created, templates used, interaction patterns",
    purpose: "Service improvement and personalization",
    retention: "2 years from last activity",
  },
  {
    category: "Technical Data",
    description: "IP address, browser type, device information, cookies",
    purpose: "Security, analytics, and service optimization",
    retention: "1 year from collection",
  },
  {
    category: "Communication Data",
    description: "Support tickets, feedback, survey responses",
    purpose: "Customer support and service improvement",
    retention: "3 years from last communication",
  },
];

const userRights = [
  {
    right: "Access",
    description: "Request a copy of your personal data",
    icon: Eye,
  },
  {
    right: "Rectification",
    description: "Correct inaccurate or incomplete data",
    icon: CheckCircle,
  },
  {
    right: "Erasure",
    description: "Request deletion of your personal data",
    icon: AlertTriangle,
  },
  {
    right: "Portability",
    description: "Receive your data in a structured format",
    icon: ArrowRight,
  },
  {
    right: "Objection",
    description: "Object to processing of your personal data",
    icon: Shield,
  },
  {
    right: "Restriction",
    description: "Limit how we process your data",
    icon: Lock,
  },
];

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("[data-section]");
      let currentSection = "";

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          currentSection = section.getAttribute("data-section") || "";
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              <Shield className="h-3 w-3 mr-1" />
              Privacy Policy
            </Badge>
            <h1 className="text-4xl font-bold mb-4">Your Privacy Matters</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
              We&apos;re committed to protecting your privacy and being
              transparent about how we collect, use, and protect your
              information.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <span>Last updated: January 15, 2024</span>
              <Separator orientation="vertical" className="h-4" />
              <span>Effective: January 15, 2024</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Table of Contents</CardTitle>
                </CardHeader>
                <CardContent>
                  <nav className="space-y-2">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`flex items-center gap-2 w-full text-left p-2 rounded-md text-sm transition-colors ${
                          activeSection === section.id
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        <section.icon className="h-4 w-4" />
                        {section.title}
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            {/* Introduction */}
            <section>
              <div className="prose prose-slate max-w-none">
                <p className="text-lg text-muted-foreground">
                  At PromptCraft, we respect your privacy and are committed to
                  protecting your personal data. This privacy policy explains
                  how we collect, use, disclose, and safeguard your information
                  when you use our platform and services.
                </p>
              </div>
            </section>

            {/* Information We Collect */}
            <section
              id="information-collection"
              data-section="information-collection"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Database className="h-6 w-6 text-primary" />
                Information We Collect
              </h2>
              <div className="space-y-6">
                <p className="text-muted-foreground">
                  We collect information you provide directly to us, information
                  we obtain automatically when you use our services, and
                  information from third-party sources.
                </p>
                <div className="grid gap-4">
                  {dataTypes.map((type, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {type.category}
                        </CardTitle>
                        <CardDescription>{type.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Purpose:</span>
                            <p className="text-muted-foreground">
                              {type.purpose}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium">Retention:</span>
                            <p className="text-muted-foreground">
                              {type.retention}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>

            {/* How We Use Information */}
            <section id="information-use" data-section="information-use">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Eye className="h-6 w-6 text-primary" />
                How We Use Information
              </h2>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  We use the information we collect to:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    Provide, maintain, and improve our services
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    Process transactions and send related information
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    Send technical notices, updates, and support messages
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    Respond to your comments, questions, and customer service
                    requests
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    Monitor and analyze trends, usage, and activities
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    Personalize and improve your experience
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    Detect, investigate, and prevent fraudulent transactions and
                    other illegal activities
                  </li>
                </ul>
              </div>
            </section>

            {/* Information Sharing */}
            <section
              id="information-sharing"
              data-section="information-sharing"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                Information Sharing
              </h2>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  We do not sell, trade, or otherwise transfer your personal
                  information to third parties except in the following
                  circumstances:
                </p>
                <Card className="border-amber-200 bg-amber-50">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-amber-800 mb-2">
                          Limited Sharing
                        </h3>
                        <ul className="space-y-1 text-sm text-amber-700">
                          <li>• With your explicit consent</li>
                          <li>• To comply with legal obligations</li>
                          <li>• To protect our rights and safety</li>
                          <li>
                            • With trusted service providers under strict
                            agreements
                          </li>
                          <li>• In connection with business transfers</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Data Security */}
            <section id="data-security" data-section="data-security">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Lock className="h-6 w-6 text-primary" />
                Data Security
              </h2>
              <div className="space-y-6">
                <p className="text-muted-foreground">
                  We implement appropriate technical and organizational security
                  measures to protect your personal information against
                  unauthorized access, alteration, disclosure, or destruction.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Shield className="h-5 w-5 text-green-500" />
                        Technical Safeguards
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• End-to-end encryption</li>
                        <li>• Secure data transmission (TLS/SSL)</li>
                        <li>• Regular security audits</li>
                        <li>• Access controls and authentication</li>
                        <li>• Data backup and recovery</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="h-5 w-5 text-blue-500" />
                        Organizational Measures
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Employee training programs</li>
                        <li>• Confidentiality agreements</li>
                        <li>• Incident response procedures</li>
                        <li>• Regular policy reviews</li>
                        <li>• Third-party security assessments</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>

            {/* Your Rights */}
            <section id="user-rights" data-section="user-rights">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                Your Rights
              </h2>
              <div className="space-y-6">
                <p className="text-muted-foreground">
                  Depending on your location, you may have certain rights
                  regarding your personal information:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {userRights.map((right, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <right.icon className="h-5 w-5 text-primary" />
                          {right.right}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {right.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-blue-800 mb-2">
                          Exercise Your Rights
                        </h3>
                        <p className="text-sm text-blue-700 mb-3">
                          To exercise any of these rights, please contact us at{" "}
                          <a
                            href="mailto:privacy@promptcraft.ai"
                            className="underline"
                          >
                            privacy@promptcraft.ai
                          </a>
                          . We will respond to your request within 30 days.
                        </p>
                        <Button size="sm" variant="outline" asChild>
                          <Link href="/contact">Contact Privacy Team</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Contact Information */}
            <section id="contact" data-section="contact">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Mail className="h-6 w-6 text-primary" />
                Contact Us
              </h2>
              <div className="space-y-6">
                <p className="text-muted-foreground">
                  If you have any questions about this Privacy Policy or our
                  privacy practices, please contact us:
                </p>
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold mb-3">Privacy Officer</h3>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <p>PromptCraft, Inc.</p>
                          <p>123 Innovation Drive, Suite 400</p>
                          <p>San Francisco, CA 94105</p>
                          <p>United States</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-3">
                          Contact Information
                        </h3>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <p className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            privacy@promptcraft.ai
                          </p>
                          <p className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            www.promptcraft.ai/privacy
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

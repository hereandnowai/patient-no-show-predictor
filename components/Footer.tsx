import React from 'react';
import { LinkedInIcon, InstagramIcon, GitHubIcon, XIcon, YouTubeIcon, BlogIcon } from './icons'; // Assuming BlogIcon is added

const brand = {
  organizationLongName: "HERE AND NOW AI - Artificial Intelligence Research Institute",
  slogan: "designed with passion for innovation",
  socialMedia: {
    blog: "https://hereandnowai.com/blog",
    linkedin: "https://www.linkedin.com/company/hereandnowai/",
    instagram: "https://instagram.com/hereandnow_ai",
    github: "https://github.com/hereandnowai",
    x: "https://x.com/hereandnow_ai",
    youtube: "https://youtube.com/@hereandnow_ai"
  }
};

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black/40 border-t border-[var(--brand-secondary-hover)] py-8 text-center">
      <div className="container mx-auto px-4">
        <p className="text-md font-semibold text-[var(--brand-primary)] mb-3">
          {brand.slogan}
        </p>
        <div className="flex justify-center space-x-5 mb-5">
          {brand.socialMedia.blog && (
            <a href={brand.socialMedia.blog} target="_blank" rel="noopener noreferrer" title="Blog" className="text-[var(--brand-text-on-secondary)] hover:text-[var(--brand-primary)] transition-colors">
              <BlogIcon className="w-6 h-6" />
              <span className="sr-only">Blog</span>
            </a>
          )}
          {brand.socialMedia.linkedin && (
            <a href={brand.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn" className="text-[var(--brand-text-on-secondary)] hover:text-[var(--brand-primary)] transition-colors">
              <LinkedInIcon className="w-6 h-6" />
              <span className="sr-only">LinkedIn</span>
            </a>
          )}
          {brand.socialMedia.instagram && (
            <a href={brand.socialMedia.instagram} target="_blank" rel="noopener noreferrer" title="Instagram" className="text-[var(--brand-text-on-secondary)] hover:text-[var(--brand-primary)] transition-colors">
              <InstagramIcon className="w-6 h-6" />
              <span className="sr-only">Instagram</span>
            </a>
          )}
          {brand.socialMedia.github && (
            <a href={brand.socialMedia.github} target="_blank" rel="noopener noreferrer" title="GitHub" className="text-[var(--brand-text-on-secondary)] hover:text-[var(--brand-primary)] transition-colors">
              <GitHubIcon className="w-6 h-6" />
              <span className="sr-only">GitHub</span>
            </a>
          )}
          {brand.socialMedia.x && (
            <a href={brand.socialMedia.x} target="_blank" rel="noopener noreferrer" title="X" className="text-[var(--brand-text-on-secondary)] hover:text-[var(--brand-primary)] transition-colors">
              <XIcon className="w-6 h-6" />
              <span className="sr-only">X</span>
            </a>
          )}
          {brand.socialMedia.youtube && (
            <a href={brand.socialMedia.youtube} target="_blank" rel="noopener noreferrer" title="YouTube" className="text-[var(--brand-text-on-secondary)] hover:text-[var(--brand-primary)] transition-colors">
              <YouTubeIcon className="w-6 h-6" />
              <span className="sr-only">YouTube</span>
            </a>
          )}
        </div>
        <p className="text-sm text-gray-400 mb-1">
          &copy; {new Date().getFullYear()} {brand.organizationLongName}. All rights reserved.
        </p>
        <p className="text-xs text-gray-500">
          Developed by Sakthi Kannan [ AI Products Engineering Team ]
        </p>
      </div>
    </footer>
  );
};
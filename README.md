# ConstructHub.ai

ConstructHub.ai is a next-gen full-stack web application for construction project planning and management with AI-powered features.

## Features

- **Modern UI/UX with Animations**: Built with Next.js, Tailwind CSS, Framer Motion, and GSAP for a stunning user experience.
- **Robust Authentication**: User and admin authentication with Clerk, including email verification via Mailjet.
- **Project Management**: Create and manage construction projects with detailed information.
- **AI Integration**: Generate floor plans using Hugging Face AI models.
- **Real-time Suggestions**: Get material and professional recommendations based on project details.
- **Admin Dashboard**: Comprehensive admin panel for user and project management.

## Tech Stack

- **Frontend**: Next.js, React 18, Tailwind CSS, Framer Motion, GSAP
- **Authentication**: Clerk
- **Database**: MongoDB
- **Email**: Mailjet
- **AI**: Groq API & Gemini2.0 Flash API 
- **UI Components**: Shadcn UI
- **Notifications**: Sonner

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account
- Clerk account
- Mailjet account
- Hugging Face account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/constructhub-ai.git
   cd constructhub-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Fill in your API keys and credentials

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/app/(home)`: Home page and landing components
- `src/app/(auth)`: Authentication pages (sign-in, sign-up, verification)
- `src/app/(dashboard)`: User and admin dashboard pages
- `src/app/api`: API routes for backend functionality
- `src/components`: Reusable UI components
- `src/lib/db`: Database models and connection
- `src/lib/services`: Service integrations (Mailjet, etc.)
- `src/lib/utils`: Utility functions

## Deployment

The application can be easily deployed on Vercel:

1. Push your code to a GitHub repository
2. Import the repository in Vercel
3. Set up the environment variables
4. Deploy

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Clerk](https://clerk.dev/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Hugging Face](https://huggingface.co/)

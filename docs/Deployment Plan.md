1.Environment
	Development: local setup for building and testing APIs/UI.
	Production: Liver version used by real users.

2.Infrastructure
	Frontend: Deployed on the Vercel (React Build).
	Backend (API): Hosted on Render.
	Database: MongoDB Atlas for managed cloud database.
	File Storage: Cloudinary for images.

3.Version Control & CI/CD
	-Code Hosted: GitHub.
	-Connected with Vercel (frontend) and Render (Backend) for auto deployment.
	-On every 'main' branch push:
		-Vercel auto builds React App.
		-Render redeploy Node.js server.
	-Manual approval for production deployment.

4.Environment Configuration
	-'.env' file for sensitive variables:
		-MONGO_URI
		-JWT_SECRET
		-CLOUDNARY_API_KEY	
	-Environment variables stored securly on Vercel/Render dashboard.

5.Deployment Steps
	1.Push code to GitHub 'main' branch.
	2.CI/DI triggers automatic build.
	3.Backend redeploy with latest code.
	4.Frontend rebuilt and serverd from CDN.
	5.Test key features post-deployment.
	

6.Monitoring & Rollback
	-User Render logs + MongoDB Atlas dashboard for error tracking.
	-Keep previous deployment snapshot for rollback
	
	
7.Security Configurations
	-Use HTTPS for all environments.
	-CORS configured only for approved domains.
	-Hide API keys and token using environment variables.
	-JWT tokens expire every 7 days for security.
	-Regular dependency and library updates for security patches
		
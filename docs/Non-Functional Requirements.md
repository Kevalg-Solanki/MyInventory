Non-Functional Requirements (NFRs)

1. Performance
	a).The system should efficiently handle up to **100 concurrent users per tenant** without noticeable lag.
	b).Average API response time must be:
		≤ 300 ms for read (GET) requests.
  		≤ 700 ms for write (POST/PATCH/DELETE) requests.
  	c).All large dataset APIs must implement pagination, filtering, and sorting.
	d).Static assets should be cached using a CDN to reduce load times.

2. Scalability
	a).The system should be designed for horizontal scaling, multiple backend instances and MongoDB sharding as needed.
	b).Adding new tenants or users should not affect existing tenants.
	c).The app should support future microservice migration without major refactoring.

3. Availability & Reliability
	a).The application should maintain 99.5 % uptime.
	b).Implement graceful shutdowns to prevent data loss during deploys.

4. Security
	a).Enforce HTTPS for all network communications.
	b).Use JWT-based authentication for user sessions.
	c).Implement Role-Based Access Control (RBAC) for tenant roles and permissions.
	d).All sensitive data (passwords, tokens) must be hashed or encrypted using industry standards (e.g., bcrypt, AES-256).
	e).Apply rate-limiting and input validation to prevent brute-force and injection attacks.
	f).Use CORS and Helmet.js to enhance API security.

5. Maintainability
	a).Code should follow clean architecture principles — separation of routes, controllers, services, and models.
	b).Use ESLint and Prettier for consistent code style.
	c).Maintain .env configuration files and environment-based setups (dev, staging, production).
	d).Provide clear documentation for APIs, services, and deployment scripts.
	e).Unit and integration tests should cover critical APIs.

6. Usability (UX)
	a).Web application must be responsive and mobile-friendly.
	b).Dashboards should load within 2 seconds on average network speeds.
	c).Provide clear success/error feedback for every major action (create/update/delete).
	d).Support dark mode and accessibility (A11y) in the future.

7. Data Integrity & Consistency
	a).All operations must include tenantId to ensure tenant-level data isolation.
	b).Use MongoDB transactions for multi-document updates (e.g., updating stock after a sale).
	c).Validate and sanitize all input data before storing it in the database.
	d).Prevent deletion of referenced records (e.g., deleting a category linked to products).

8. Logging & Monitoring
	a).Log all critical user and system actions in Activity Logs.
	b).Use Winston or Morgan for request and error logging.
	c).Store logs for at least 30 days and rotate them automatically.
	d).Use monitoring tools to track performance and uptime.

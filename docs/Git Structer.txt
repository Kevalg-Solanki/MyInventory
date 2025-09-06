main → stable, production-ready code
dev → integration branch (where features get merged before main)
feature/* → per feature or task
	feature/auth-api
	feature/product-crud

fix/* → for bug fixes
	fix/login-bug

hotfix/* → urgent production bug

👉 Flow:
Create branch from dev → work → commit → PR/Merge into dev.
After testing, merge dev → main.
Tag version (v1.0.0).

 2. Commit Message Convention
Follow Conventional Commits (industry standard):
	<type>(scope): short description

Types use:
	feat → new feature
	fix → bug fix
	docs → documentation changes
	style → code style (formatting, linting, no logic changes)
	refactor → code change (not bug/feature)
	test → adding/editing tests
	chore → maintenance tasks (deps, config, CI/CD)

Example
feat(auth): add mobile OTP verification API
fix(product): resolve price update bug
docs(api): update README with sales endpoints
refactor(db): optimize query for stock history
chore(ci): add GitHub Actions for linting


3.Commit Rules

1.Keep commits small and focused (1 logical change = 1 commit).
2.Use imperative mood (e.g., "add", not "added").
3.Add detailed body if needed:

Example
	feat(sale): add invoice generation
	
	- generate invoice as PDF
	- store invoice id in sales table
	- add download endpoint
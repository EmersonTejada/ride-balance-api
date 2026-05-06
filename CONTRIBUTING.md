# Contributing to Ride Balance

## Git Workflow

### Branch Strategy

We use a simplified GitFlow with three main branches:

| Branch | Purpose | Protected |
|--------|---------|----------|
| `main` | Production code | Yes |
| `develop` | Staging code | Yes |
| `feature/*` | Feature development | No |

### Branch Naming

```
feature/<type>-<description>
bugfix/<type>-<description>
hotfix/<type>-<description>
```

Examples:
- `feature/api-user-authentication`
- `bugfix/fix-expense-calculation`
- `hotfix/security-patch`

### Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

#### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `chore` | DevOps, dependencies, build |
| `docs` | Documentation |
| `refactor` | Code refactoring |
| `test` | Adding/updating tests |

#### Examples

```
feat(auth): add JWT refresh token endpoint
fix(api): resolve rides endpoint pagination
chore(devops): add lint job to CI pipeline
docs(readme): update installation instructions
```

## Development Flow

### 1. Start a Feature

```bash
git checkout develop
git pull origin develop
git checkout -b feature/my-new-feature
```

### 2. Work on Feature

```bash
# Make changes, then commit
git add .
git commit -m "feat(my-feature): add new functionality"
```

### 3. Submit Merge Request

```bash
git push -u origin feature/my-new-feature
# Create MR in GitLab targeting 'develop'
```

### 4. Code Review

- At least 1 approval required
- All CI checks must pass
- No unresolved comments

### 5. Merge to Develop

Once approved:
- Merge to `develop` (squash or rebase)
- Delete feature branch
- CI will deploy to staging automatically

### 6. Release to Production

```bash
# Create MR from 'develop' to 'main'
# Requires approval
# Manual deploy trigger to production
```

## CI/CD Pipeline

### Stages

1. **validate**: Lint, TypeScript, Security audit
2. **test**: Unit + Integration tests
3. **build**: Docker image
4. **deploy**: Staging (auto) / Production (manual)

### Environment Rules

| Branch | Trigger | Deploys To |
|--------|---------|------------|
| `feature/*` | MR to develop | - |
| `develop` | Push | Staging (auto) |
| `main` | MR approved | Production (manual) |

## Code Standards

- TypeScript strict mode enabled
- ESLint rules enforced in CI
- All functions must have types
- Error handling required
- Tests for new features
#!/bin/bash

# The foundation branch
SOURCE="main"

echo "Fetching latest from origin..."
git fetch origin $SOURCE

# Get all your demo branches (excluding the base/main)
branches=$(git branch --list 'demo-*' | sed 's/*//g' | xargs)

for branch in $branches; do
    echo -e "\n--- Processing $branch ---"
    
    # Ensure we start from a clean state in case a previous rebase hung
    git rebase --abort 2>/dev/null
    git checkout "$branch"
    
    echo "Rebasing $branch onto origin/$SOURCE..."
    
    # -X ours tells Git: "If there is a conflict, use the version from main"
    # This automatically fixes package.json and package-lock.json issues.
    if git rebase "origin/$SOURCE" -X ours; then
        echo "✅ $branch updated successfully."
        
        # Optional: Sync local node_modules just to be safe
        # npm install 

        # Push the changes to GitHub
        git push origin "$branch" --force
    else
        echo "❌ Conflict in $branch that couldn't be auto-resolved."
        echo "Usually this means a complex change in App.jsx."
        echo "Fix manually, then run 'git rebase --continue'."
        exit 1
    fi
done

git checkout $SOURCE
echo -e "\n🎉 All demo branches have been synced with main."
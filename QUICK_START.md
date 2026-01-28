# Quick Start Guide

## Getting Started

### Installation
```bash
npm install
npm run dev
```

The app will open at `http://localhost:3000`

## Page Overview

### 1. Overview Page
**What you see**: Financial dashboard with current status

**Key sections**:
- Current month summary (income, expenses, balance)
- All-time totals
- Recent transactions

**Actions available**:
- Click "+ Add Income" to record new income
- View recent income and expense history

---

### 2. Expense Management
**What you see**: Complete expense tracking interface

**Key sections**:
- Add expense form
- Filter controls (category, month, year)
- Summary with category breakdown
- Complete expense list

**Actions available**:
- Click "+ Add Expense" to log new expense
- Use filters to view specific time periods or categories
- Review spending patterns by category

**Tips**:
- Add notes to expenses for better tracking
- Use filters to analyze monthly spending
- Check category totals to identify spending patterns

---

### 3. Budget Management
**What you see**: Budget monitoring dashboard

**Key sections**:
- Overall budget summary for selected month
- Individual category budget cards
- Progress bars and usage percentages
- Budget calculation explanation

**Actions available**:
- Click "Edit" on any category to change budget limit
- Select different month/year to view historical budgets
- Monitor spending vs. budget limits

**Visual indicators**:
- 🟢 Green: Under 80% of budget (safe)
- 🟠 Orange: 80-100% of budget (warning)
- 🔴 Red: Over 100% of budget (action needed)
- Red border: Category is over budget
- ⚠️ Warning message: Shows exact overspend amount

---

## Common Tasks

### Adding Income
1. Go to **Overview** page
2. Click **"+ Add Income"** button
3. Fill in:
   - Amount (required)
   - Source (required, e.g., "Salary", "Freelance")
   - Date (required, defaults to today)
4. Click **"Add Income"** button
5. Form closes, income appears in list

### Adding Expense
1. Go to **Expense Management** page
2. Click **"+ Add Expense"** button
3. Fill in:
   - Amount (required)
   - Category (required, select from dropdown)
   - Date (required, defaults to today)
   - Note (optional, for additional details)
4. Click **"Add Expense"** button
5. Expense appears in table immediately

### Setting/Updating Budget
1. Go to **Budget Management** page
2. Find the category you want to update
3. Click **"Edit"** button on that card
4. Enter new monthly limit
5. Click **"Save"** to confirm or **"Cancel"** to discard
6. Progress bars update automatically

### Filtering Expenses
1. Go to **Expense Management** page
2. Use the three filter dropdowns:
   - **Category**: Select specific category or "All Categories"
   - **Month**: Select month to view
   - **Year**: Select year to view
3. Expense list and totals update automatically

### Viewing Different Time Periods
1. Both **Expense Management** and **Budget Management** have month/year selectors
2. Select desired month from dropdown
3. Select desired year from dropdown
4. All data updates to show selected period

---

## Understanding the Data

### Mock Data Included
The app comes with sample data:
- Multiple income entries
- Expenses across all categories
- Pre-set budget limits
- Mix of current and previous month data

### Intentional Over-Budget Example
**Food & Dining** category is intentionally set over budget to demonstrate:
- Red progress bar
- Red card border
- Warning message
- Overspend calculation

You can experiment with this by:
1. Adding more expenses to other categories
2. Lowering budget limits
3. Observing how indicators change

---

## Data Persistence

**Important**: Data is stored in memory only
- Changes persist during your browser session
- Refreshing the page resets to mock data
- No backend or database required

To make data permanent, you would need to add:
- Local storage
- Backend API
- Database integration

---

## Tips & Best Practices

### Budgeting Strategy
1. **Start Conservative**: Set budget limits you can realistically meet
2. **Monitor Weekly**: Check budget status weekly, not just month-end
3. **Adjust as Needed**: Edit budgets based on actual spending patterns
4. **Use Notes**: Add expense notes for better tracking and memory

### Expense Tracking
1. **Log Immediately**: Enter expenses when they occur
2. **Be Specific**: Use notes for details you'll want later
3. **Categorize Correctly**: Consistent categorization helps analysis
4. **Review Monthly**: Use filters to analyze spending patterns

### Using Filters Effectively
1. **Compare Months**: Switch between months to see trends
2. **Category Focus**: Filter by category to understand specific spending
3. **Find Anomalies**: Look for unusually high expenses in filtered views

---

## Troubleshooting

### Issue: Data disappeared after refresh
**Solution**: This is expected behavior. Data is in-memory only. Re-enter data or use mock data provided.

### Issue: Can't see my new expense
**Solution**: Check your filter settings. The expense might be in a different month or category.

### Issue: Budget not updating
**Solution**: Make sure you clicked "Save" after editing. Click "Cancel" discards changes.

### Issue: Progress bar looks wrong
**Solution**: Verify the budget limit is set correctly. $0 budget will show unusual percentages.

---

## Feature Highlights

### Smart Calculations
- Automatic total calculations
- Real-time budget usage updates
- Percentage calculations accurate to 1 decimal place
- Negative value handling for over-budget scenarios

### User-Friendly Interface
- Clean, professional design
- Clear visual hierarchy
- Consistent color coding
- Responsive layout

### Data Management
- Easy data entry forms
- Flexible filtering options
- Comprehensive views
- Detailed breakdowns

### Budget Monitoring
- Multiple visual indicators
- Real-time updates
- Historical views
- Category-level detail

---

## Keyboard Shortcuts

While the app doesn't have custom shortcuts, standard browser shortcuts work:
- **Tab**: Navigate between form fields
- **Enter**: Submit forms
- **Esc**: Close dropdowns
- **Click**: Activate buttons and controls

---

## Next Steps

After exploring the app:
1. Try adding your own income
2. Log some expenses
3. Adjust budget limits
4. Use filters to view different time periods
5. Observe how over-budget indicators work
6. Experiment with different scenarios

---

## Support & Documentation

Additional documentation:
- **README.md**: Overview and setup instructions
- **IMPLEMENTATION.md**: Technical details and architecture
- **VISUAL_GUIDE.md**: Detailed explanation of visual indicators

---

## Frequently Asked Questions

**Q: Can I add my own categories?**
A: Currently, categories are fixed. You can use "Other" for miscellaneous expenses.

**Q: Can I delete or edit expenses?**
A: Current version doesn't support editing/deleting. This would be a future enhancement.

**Q: Why does my balance show negative?**
A: If expenses exceed income, balance will be negative. This is shown in red/orange.

**Q: Can I export my data?**
A: Not currently. Export to CSV would be a useful future feature.

**Q: Can multiple people use this?**
A: Currently single-user. Multi-user would require authentication and backend.

**Q: Does it work on mobile?**
A: Yes, it's responsive, but optimized for desktop use.

---

## Conclusion

This Personal Finance & Budget Planner provides:
✅ Complete income and expense tracking
✅ Category-based budgeting
✅ Visual budget overrun indicators
✅ Flexible filtering and reporting
✅ Clean, professional interface
✅ Realistic user experience

Start by exploring the demo data, then try adding your own entries!

# Quick Start Guide: AI Charts Website

## Overview
This guide will walk you through setting up and testing the AI Charts website locally. The application allows users to generate interactive charts from natural language descriptions using AI.

## Prerequisites
- Node.js 18+ and npm/yarn
- Git for version control
- Text editor or IDE
- Browser for testing

## Environment Setup

### 1. Clone and Install Dependencies
```bash
git clone <repository-url>
cd ai-charts
npm install
```

### 2. Environment Configuration
Create a `.env.local` file in the project root:
```bash
# Alibaba Cloud Bailian API Key
DASHSCOPE_API_KEY=your_api_key_here

# Optional: Custom base URL for development
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000

# Optional: Analytics (future use)
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

### 3. Development Server
```bash
npm run dev
```
Visit `http://localhost:3000` to see the application.

## Testing User Scenarios

### Scenario 1: Basic Chart Generation
**Goal**: Test primary user flow from input to chart display

**Steps**:
1. Open the homepage at `http://localhost:3000`
2. Verify centered input box is displayed
3. Enter: "Compare Beijing sales 120,130,150 vs Shanghai sales 100,140,160"
4. Click submit or press Enter

**Expected Results**:
- Layout changes: input moves to bottom, chart area appears above
- Bar chart displays with two series (Beijing, Shanghai)
- Chart shows three data points for each city
- Chart title and labels are automatically generated
- Chart is interactive (hover tooltips, responsive)

**Validation**:
- [ ] Input box moves to bottom
- [ ] Chart renders without errors
- [ ] Data matches input (Beijing: 120,130,150; Shanghai: 100,140,160)
- [ ] Chart is responsive on mobile devices
- [ ] Tooltips show correct values

### Scenario 2: Specified Chart Type
**Goal**: Test user-specified chart type functionality

**Steps**:
1. Clear any existing chart
2. Enter: "Show pie chart for market share: Apple 30, Samsung 25, Others 45"
3. Submit the prompt

**Expected Results**:
- Pie chart is generated (not bar chart)
- Three segments: Apple (30%), Samsung (25%), Others (45%)
- Legend shows all three categories
- Chart uses appropriate colors

**Validation**:
- [ ] Chart type is pie (not auto-selected bar)
- [ ] All three segments are visible
- [ ] Percentages add up to 100%
- [ ] Legend is properly displayed

### Scenario 3: Error Handling
**Goal**: Test error handling for invalid inputs

**Steps**:
1. Enter empty string and submit
2. Enter: "Hello world" (no data) and submit
3. Enter: "Show chart for invalid data xyz abc" and submit

**Expected Results**:
- Toast notifications appear for each error
- Error messages are user-friendly
- Input box remains accessible
- No broken chart displays

**Validation**:
- [ ] Toast appears for empty input
- [ ] Toast appears for no-data input
- [ ] Error messages are helpful
- [ ] UI remains functional after errors

### Scenario 4: Conversation Context
**Goal**: Test iterative chart modifications

**Steps**:
1. Generate initial chart: "Monthly sales: Jan 100, Feb 150, Mar 200"
2. Wait for chart to appear
3. Enter follow-up: "Change to line chart"
4. Submit modification request

**Expected Results**:
- Same data is retained (100, 150, 200)
- Chart type changes from bar to line
- Previous chart is replaced smoothly
- Context is maintained

**Validation**:
- [ ] Data values remain the same
- [ ] Chart type changes to line
- [ ] Smooth transition between chart types
- [ ] No data loss during modification

### Scenario 5: Multiple Language Support
**Goal**: Test internationalization capabilities

**Steps**:
1. Enter Chinese data: "显示北京和上海的销售对比：北京 120，上海 100"
2. Submit prompt
3. Test with mixed language: "Compare 北京 sales 120 vs Shanghai sales 100"

**Expected Results**:
- AI correctly parses Chinese text
- Chart labels can display Chinese characters
- Mixed language input is handled properly
- UI remains functional regardless of input language

**Validation**:
- [ ] Chinese text is processed correctly
- [ ] Chart displays Chinese labels properly
- [ ] Mixed language input works
- [ ] No encoding issues

### Scenario 6: Responsive Design
**Goal**: Test mobile and tablet compatibility

**Steps**:
1. Open developer tools and test different screen sizes:
   - Mobile (320px width)
   - Tablet (768px width)
   - Desktop (1200px width)
2. Generate a chart on each screen size
3. Test input box functionality on touch devices

**Expected Results**:
- Layout adapts to screen size
- Charts remain readable on small screens
- Input box is accessible on mobile
- Touch interactions work properly

**Validation**:
- [ ] Layout is responsive across screen sizes
- [ ] Charts are readable on mobile
- [ ] Input is accessible on touch devices
- [ ] No horizontal scrolling on mobile

## API Testing

### Direct API Testing
Test the API endpoints directly using curl or a tool like Postman:

```bash
# Test chart generation
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Sales data: Q1 100, Q2 150, Q3 200"}'

# Test health endpoint
curl http://localhost:3000/api/health
```

**Expected API Response**:
```json
{
  "success": true,
  "chartConfig": {
    "title": { "text": "Sales Data" },
    "xAxis": { "data": ["Q1", "Q2", "Q3"] },
    "yAxis": {},
    "series": [{
      "name": "Sales",
      "type": "bar",
      "data": [100, 150, 200]
    }]
  },
  "conversationId": "conv_123",
  "message": "Generated bar chart for quarterly sales data"
}
```

## Performance Validation

### Load Testing
1. Generate multiple charts rapidly (10+ requests)
2. Test with large datasets (100+ data points)
3. Test concurrent users (if possible)

**Performance Targets**:
- Chart generation: < 500ms
- Page load: < 2 seconds
- Chart rendering: < 100ms
- Memory usage: Stable over time

## Common Issues and Solutions

### Issue: Chart not rendering
**Solution**: Check browser console for JavaScript errors, verify ECharts is loaded

### Issue: AI API errors
**Solution**: Verify DASHSCOPE_API_KEY is set correctly in .env.local

### Issue: Toast notifications not appearing
**Solution**: Check that shadcn/ui toast components are properly installed

### Issue: Responsive layout broken
**Solution**: Verify Tailwind CSS is configured and compiled correctly

## Development Workflow

### Making Changes
1. Make code changes in relevant files
2. Test changes using the scenarios above
3. Run type checking: `npm run type-check`
4. Run linting: `npm run lint`
5. Commit changes with descriptive messages

### Adding New Features
1. Update data model in `data-model.md` if needed
2. Update API contracts if adding new endpoints
3. Add test scenarios to this guide
4. Implement feature following constitutional principles
5. Test all existing scenarios to ensure no regression

## Success Criteria
The quickstart is successful when:
- [ ] All 6 test scenarios pass
- [ ] API endpoints respond correctly
- [ ] Performance targets are met
- [ ] No critical errors in browser console
- [ ] Application works on mobile and desktop
- [ ] AI generates appropriate charts for various inputs

## Next Steps
After successful quickstart:
1. Run the full test suite: `npm test`
2. Test deployment to staging environment
3. Conduct user acceptance testing
4. Review security considerations
5. Plan production deployment
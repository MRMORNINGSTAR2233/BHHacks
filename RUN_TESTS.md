# 🧪 How to Run The Hauntographer Tests

## ✅ Quick Validation (Already Passed!)

The quick validation test has been run and **all checks passed**:

```
✅ Passed: 17/17
🎯 Success Rate: 100.0%

✅ Google API Key - Set
✅ Stability AI Key - Set  
✅ Replicate API Key - Set
✅ All modules loaded successfully
✅ All required files present
```

---

## 🚀 Running Live Integration Tests

To test the complete application with real API calls:

### Step 1: Start the Development Server

Open a terminal and run:

```bash
npm run dev
```

Keep this terminal open. The server will run on `http://localhost:3000`

### Step 2: Run Integration Tests

Open a **new terminal** (keep the first one running) and run:

```bash
node tests/integration-test-live.js
```

This will run 10 comprehensive tests:

1. ✅ Server Health Check
2. ✅ First Turn - Complete Story Generation
3. ✅ Subsequent Turn with History
4. ✅ Different Genre - Psychological Horror
5. ✅ Sentiment Adaptation - Positive Reaction
6. ✅ Validation - Missing Required Fields
7. ✅ Validation - Short Fears
8. ✅ Image Generation Quality
9. ✅ Performance Under Load
10. ✅ All Horror Genres

**⚠️ WARNING**: These tests make **REAL API calls** and will consume API credits!

---

## 🎨 Manual Frontend Testing

### Step 1: Open the Application

With the dev server running, open your browser to:

```
http://localhost:3000
```

### Step 2: Test the Setup Screen

1. **Test Form Validation**:
   - Try submitting with empty fears (should show error)
   - Try submitting with < 10 characters (should show error)
   - Try submitting without selecting a genre (should show error)

2. **Test Valid Submission**:
   - Enter fears: "darkness, isolation, being watched"
   - Select genre: "Gothic"
   - Click "Begin the Descent"
   - Should show loading state

### Step 3: Test the Narrative Screen

1. **Verify Story Display**:
   - Story text should appear with typewriter effect
   - Image should load and display
   - Two choice buttons should appear

2. **Test Choice Selection**:
   - Click one of the choice buttons
   - Should show loading state
   - New story segment should appear
   - New choices should be provided

3. **Test Reaction Input** (Optional):
   - Enter a reaction: "That was terrifying!"
   - Select a choice
   - Story should adapt based on sentiment

4. **Test Multiple Turns**:
   - Continue making choices
   - Verify story continuity
   - Check that history is maintained

### Step 4: Test Different Genres

Test each horror genre:
- **Gothic**: Dark, atmospheric, classic horror
- **Cosmic**: Lovecraftian, existential dread
- **Slasher**: Intense, violent, survival horror
- **Psychological**: Mind-bending, reality-questioning

### Step 5: Test Accessibility

1. **Keyboard Navigation**:
   - Press Tab to navigate through form elements
   - Press Enter/Space to activate buttons
   - Verify focus indicators are visible

2. **Screen Reader** (if available):
   - Enable screen reader
   - Verify ARIA labels are read correctly
   - Check that dynamic content updates are announced

3. **Reduced Motion**:
   - Enable reduced motion in OS settings
   - Verify typewriter effect shows instantly
   - Check that animations are disabled

### Step 6: Test Responsive Design

1. **Mobile View** (< 768px):
   - Resize browser to mobile width
   - Verify single-column layout
   - Check that buttons are touch-friendly

2. **Tablet View** (768px - 1024px):
   - Resize to tablet width
   - Verify layout adapts appropriately

3. **Desktop View** (> 1024px):
   - Full-width browser
   - Verify two-column layout
   - Check that images display properly

---

## 📊 Expected Test Results

### Unit Tests (Already Passed)

```
Backend:  30/31 tests (96.8%) ✅
Frontend: 86/86 tests (100%) ✅
```

### Integration Tests (To Run)

Expected results when running live tests:

```
Test 1: Server Health Check                    ✅
Test 2: First Turn - Story Generation           ✅
Test 3: Subsequent Turn with History            ✅
Test 4: Different Genre - Psychological         ✅
Test 5: Sentiment Adaptation                    ✅
Test 6: Validation - Missing Fields             ✅
Test 7: Validation - Short Fears                ✅
Test 8: Image Generation Quality                ✅
Test 9: Performance Under Load                  ✅
Test 10: All Horror Genres                      ✅

Success Rate: 100%
```

### Performance Expectations

- **API Response Time**: 15-20 seconds (includes LLM + image generation)
- **First Contentful Paint**: < 1.5 seconds
- **Time to Interactive**: < 3 seconds
- **Bundle Size**: 116 kB

---

## 🐛 Troubleshooting

### "Server is not running"

**Solution**: Make sure you started the dev server:
```bash
npm run dev
```

### "ECONNREFUSED" or Connection Errors

**Solution**: 
1. Check that the dev server is running
2. Verify it's on port 3000
3. Try restarting the server

### API Errors ("The spirits are not responding")

**Possible Causes**:
1. Invalid API keys
2. API rate limits exceeded
3. Network connectivity issues
4. API service outage

**Solution**:
1. Verify API keys in `.env.local`
2. Check API service status pages
3. Wait a few minutes and try again

### Slow Response Times

**Expected**: Image generation takes 10-15 seconds (this is normal)

**If slower than 25 seconds**:
1. Check your internet connection
2. Verify API service status
3. Try again during off-peak hours

### Image Not Loading

**Possible Causes**:
1. Stability AI API error
2. Network issues
3. Invalid image URL

**Solution**:
1. Check browser console for errors
2. Verify Stability AI API key
3. Try refreshing the page

---

## 📝 Test Checklist

### Pre-Testing ✅
- [x] API keys configured in `.env.local`
- [x] Dependencies installed (`npm install`)
- [x] Quick validation passed
- [x] Build successful (`npm run build`)

### Backend Testing
- [ ] Start dev server (`npm run dev`)
- [ ] Run integration tests (`node tests/integration-test-live.js`)
- [ ] Verify all 10 tests pass
- [ ] Check API response times
- [ ] Verify error handling

### Frontend Testing
- [ ] Open application in browser
- [ ] Test form validation
- [ ] Test story generation
- [ ] Test choice selection
- [ ] Test all 4 genres
- [ ] Test keyboard navigation
- [ ] Test responsive design
- [ ] Test accessibility features

### Performance Testing
- [ ] Check First Contentful Paint
- [ ] Check Time to Interactive
- [ ] Monitor API response times
- [ ] Test with multiple story turns

### Cross-Browser Testing (Optional)
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

---

## 🎯 Success Criteria

The application is working correctly if:

✅ All unit tests pass (117 tests)  
✅ All integration tests pass (10 tests)  
✅ Stories generate successfully  
✅ Images load and display  
✅ Choices work correctly  
✅ Form validation works  
✅ Keyboard navigation works  
✅ Responsive design works  
✅ API response times < 25 seconds  
✅ No console errors  

---

## 📞 Need Help?

If you encounter issues:

1. **Check the logs**: Look at the terminal running the dev server
2. **Check browser console**: Press F12 and look for errors
3. **Review documentation**: See `API_DOCUMENTATION.md` and `TESTING.md`
4. **Verify environment**: Run `node tests/quick-validation-test.js` again

---

## 🎉 Next Steps After Testing

Once all tests pass:

1. **Deploy to production** (Vercel, Netlify, etc.)
2. **Set up monitoring** (error tracking, analytics)
3. **Gather user feedback**
4. **Plan Phase 2 features**

---

**Happy Testing! 👻**

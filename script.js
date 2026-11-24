/**
 * CBM INDIA TRUST — INTERACTIVE HOMEPAGE SCRIPT
 * Handles:
 * 1. Accessibility Panel & All 8 Toggles (OFF by default, strictly explicit user control)
 * 2. Reading Guide Cursor Tracking
 * 3. Hero Carousel & Interactive Slide State
 * 4. Animated Number Counters in Indian Numbering System
 * 5. Interactive Modals (Story Reader, Video Preview, Donation Prototype)
 * 6. Sticky Header & Mobile Navigation
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. ACCESSIBILITY SYSTEM (Strictly OFF by default)
     ========================================================================== */
  const a11yPanel = document.getElementById('accessibility-panel');
  const a11yBackdrop = document.getElementById('accessibilityBackdrop');
  const a11yNavTrigger = document.getElementById('accessibilityNavTrigger');
  const a11yFloatTrigger = document.getElementById('accessibilityFloatTrigger');
  const a11yCloseBtn = document.getElementById('a11yCloseBtn');
  const a11yResetBtn = document.getElementById('a11yResetBtn');
  const a11yActiveCount = document.getElementById('a11yActiveCount');
  const a11yLiveRegion = document.getElementById('a11y-live-region');
  const footerA11yBtn = document.getElementById('footerA11yBtn');
  const readingGuide = document.getElementById('reading-guide');

  // Accessibility state map — all false (OFF) on load
  const a11yState = {
    'contrast': false,
    'highlight-links': false,
    'bigger-text': false,
    'text-spacing': false,
    'pause-animations': false,
    'hide-images': false,
    'dyslexia': false,
    'cursor': false
  };

  // Class mapping to body
  const a11yClassMap = {
    'contrast': 'accessibility-contrast',
    'highlight-links': 'accessibility-highlight-links',
    'bigger-text': 'accessibility-bigger-text',
    'text-spacing': 'accessibility-text-spacing',
    'pause-animations': 'accessibility-pause-animations',
    'hide-images': 'accessibility-hide-images',
    'dyslexia': 'accessibility-dyslexia',
    'cursor': 'accessibility-cursor'
  };

  const a11yNameMap = {
    'contrast': 'High Contrast',
    'highlight-links': 'Highlight Links',
    'bigger-text': 'Bigger Text',
    'text-spacing': 'Text Spacing',
    'pause-animations': 'Pause Animations',
    'hide-images': 'Hide Images',
    'dyslexia': 'Dyslexia Friendly Font',
    'cursor': 'Accessible Cursor & Guide'
  };

  // Open accessibility panel
  function openA11yPanel() {
    a11yPanel.removeAttribute('hidden');
    // slight delay for transition
    requestAnimationFrame(() => {
      a11yPanel.classList.add('active');
      a11yBackdrop.classList.add('active');
      a11yNavTrigger.setAttribute('aria-expanded', 'true');
      a11yFloatTrigger.setAttribute('aria-expanded', 'true');
      a11yCloseBtn.focus();
    });
  }

  // Close accessibility panel
  function closeA11yPanel() {
    a11yPanel.classList.remove('active');
    a11yBackdrop.classList.remove('active');
    a11yNavTrigger.setAttribute('aria-expanded', 'false');
    a11yFloatTrigger.setAttribute('aria-expanded', 'false');
    setTimeout(() => {
      a11yPanel.setAttribute('hidden', '');
    }, 240);
  }

  // Event Listeners for Opening/Closing
  if (a11yNavTrigger) a11yNavTrigger.addEventListener('click', openA11yPanel);
  if (a11yFloatTrigger) a11yFloatTrigger.addEventListener('click', openA11yPanel);
  if (footerA11yBtn) footerA11yBtn.addEventListener('click', openA11yPanel);
  if (a11yCloseBtn) a11yCloseBtn.addEventListener('click', closeA11yPanel);
  if (a11yBackdrop) a11yBackdrop.addEventListener('click', closeA11yPanel);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (a11yPanel.classList.contains('active')) {
        closeA11yPanel();
      }
      closeAllModals();
    }
  });

  // Reading Guide mouse tracking
  document.addEventListener('mousemove', (e) => {
    if (a11yState['cursor'] && readingGuide) {
      readingGuide.style.top = `${e.clientY}px`;
    }
  });

  // Toggle single accessibility feature
  function toggleFeature(featureKey, cardEl) {
    const isCurrentlyOn = a11yState[featureKey];
    const newState = !isCurrentlyOn;
    a11yState[featureKey] = newState;

    const bodyClass = a11yClassMap[featureKey];
    const statusPill = cardEl.querySelector('.a11y-pill-status');

    if (newState) {
      document.body.classList.add(bodyClass);
      cardEl.classList.add('active');
      cardEl.setAttribute('aria-checked', 'true');
      if (statusPill) statusPill.textContent = 'ON';
      announceToScreenReader(`${a11yNameMap[featureKey]} activated.`);
    } else {
      document.body.classList.remove(bodyClass);
      cardEl.classList.remove('active');
      cardEl.setAttribute('aria-checked', 'false');
      if (statusPill) statusPill.textContent = 'OFF';
      announceToScreenReader(`${a11yNameMap[featureKey]} turned off.`);
    }

    updateActiveCount();
  }

  // Update count indicator
  function updateActiveCount() {
    const activeKeys = Object.keys(a11yState).filter(k => a11yState[k]);
    const count = activeKeys.length;
    if (a11yActiveCount) {
      a11yActiveCount.textContent = count === 1 ? '1 feature active' : `${count} features active`;
    }
  }

  // Reset all features to default (OFF)
  function resetAllA11y() {
    Object.keys(a11yState).forEach(key => {
      a11yState[key] = false;
      document.body.classList.remove(a11yClassMap[key]);
      const card = document.querySelector(`[data-feature="${key}"]`);
      if (card) {
        card.classList.remove('active');
        card.setAttribute('aria-checked', 'false');
        const pill = card.querySelector('.a11y-pill-status');
        if (pill) pill.textContent = 'OFF';
      }
    });
    updateActiveCount();
    announceToScreenReader('All accessibility settings have been restored to default.');
  }

  if (a11yResetBtn) {
    a11yResetBtn.addEventListener('click', resetAllA11y);
  }

  // Attach click listeners to all 8 feature cards
  const a11yCards = document.querySelectorAll('.a11y-toggle-card');
  a11yCards.forEach(card => {
    card.addEventListener('click', () => {
      const featureKey = card.getAttribute('data-feature');
      if (featureKey && a11yState.hasOwnProperty(featureKey)) {
        toggleFeature(featureKey, card);
      }
    });
  });

  function announceToScreenReader(msg) {
    if (a11yLiveRegion) {
      a11yLiveRegion.textContent = '';
      setTimeout(() => {
        a11yLiveRegion.textContent = msg;
      }, 50);
    }
  }

  /* ==========================================================================
     2. HERO SLIDER INTERACTION
     ========================================================================== */
  const heroImage = document.querySelector('.hero-image');
  const sliderDots = document.querySelectorAll('.slider-dots .dot');
  const sliderPrevBtn = document.getElementById('sliderPrevBtn');
  const sliderNextBtn = document.getElementById('sliderNextBtn');

  const heroSlides = [
    {
      img: 'assets/hero-skills.jpg',
      alt: 'Young Indian adults with and without disabilities learning IT and digital skills in the computer lab at Parivarthan Skills Academy'
    },
    {
      img: 'assets/work-education.jpg',
      alt: 'Children with and without disabilities collaborating joyfully in an inclusive school classroom'
    },
    {
      img: 'assets/impact-eye-care.jpg',
      alt: 'Compassionate pediatric and adult eye examination screening in rural community clinic'
    }
  ];

  let currentSlideIndex = 0;

  function setSlide(index) {
    currentSlideIndex = (index + heroSlides.length) % heroSlides.length;
    if (heroImage) {
      heroImage.style.opacity = '0.4';
      setTimeout(() => {
        heroImage.src = heroSlides[currentSlideIndex].img;
        heroImage.alt = heroSlides[currentSlideIndex].alt;
        heroImage.style.opacity = '1';
      }, 140);
    }

    sliderDots.forEach((dot, i) => {
      const isActive = i === currentSlideIndex;
      dot.classList.toggle('active', isActive);
      dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }

  if (sliderPrevBtn) {
    sliderPrevBtn.addEventListener('click', () => setSlide(currentSlideIndex - 1));
  }
  if (sliderNextBtn) {
    sliderNextBtn.addEventListener('click', () => setSlide(currentSlideIndex + 1));
  }

  sliderDots.forEach((dot, i) => {
    dot.addEventListener('click', () => setSlide(i));
  });

  /* ==========================================================================
     3. ANIMATED NUMBER COUNTERS (Indian Numbering Formatting)
     ========================================================================== */
  const statCounters = document.querySelectorAll('.stat-counter');

  function formatIndianNumber(num) {
    return num.toLocaleString('en-IN');
  }

  function animateCounters() {
    statCounters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-count'), 10);
      if (isNaN(target)) return;

      // If pause-animations is active or user prefers reduced motion, set instantly
      if (a11yState['pause-animations'] || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        counter.textContent = formatIndianNumber(target);
        return;
      }

      const duration = 1800; // ms
      const startTime = performance.now();

      function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutQuart curve
        const ease = 1 - Math.pow(1 - progress, 4);
        const currentVal = Math.floor(ease * target);
        counter.textContent = formatIndianNumber(currentVal);

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        } else {
          counter.textContent = formatIndianNumber(target);
        }
      }

      requestAnimationFrame(updateNumber);
    });
  }

  // Trigger counters with IntersectionObserver
  let countersAnimated = false;
  const impactSection = document.getElementById('impact');
  if (impactSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          animateCounters();
        }
      });
    }, { threshold: 0.2 });

    observer.observe(impactSection);
  }

  /* ==========================================================================
     4. STORIES OF CHANGE MODAL READER
     ========================================================================== */
  const storyModal = document.getElementById('storyModal');
  const storyModalContent = document.getElementById('storyModalContent');
  const storyModalClose = document.getElementById('storyModalClose');

  const storyDetails = {
    'pranav': {
      title: '“A Tiny Movement, A Very Big Impact”',
      subtitle: 'Early Intervention Center — Overcoming Developmental Delays',
      img: 'assets/story-pranav.jpg',
      badge: 'Early Intervention',
      paragraphs: [
        'Four-year-old Pranav arrives at our Early Intervention Center laughing. He has had his breakfast at home, and his mother or his elder sister Jhalak has gotten him ready for an exciting morning.',
        'When Pranav was diagnosed with motor and cognitive developmental delays at age two, his family felt overwhelmed by uncertainties. Through CBM India’s community partner network, Pranav was enrolled in specialized pediatric occupational and speech therapy.',
        'Today, Pranav can grasp building blocks, communicate his needs with joy, and take confident assisted steps. His mother shares: “Seeing my son smile with such pride as he accomplishes every tiny milestone gives our entire family boundless hope. CBM has taught us that early support unlocks lifelong dignity.”'
      ]
    },
    'confidence': {
      title: 'Carving Her Space and Confidence',
      subtitle: 'Parivarthan Vocational Academy — Digital Literacy & Corporate Employment',
      img: 'assets/story-confidence.jpg',
      badge: 'Inclusive Livelihoods',
      paragraphs: [
        '“Independent life is very important. That is why I chose to go out for a job, not stay at home. I want to stand on my own feet, contribute to my household, and feel self-reliant every single day.”',
        'After completing intensive training in Domestic IT Helpdesk and Retail Sales through CBM India’s Parivarthan Skills Academy, she secured a full-time position with a major enterprise services provider.',
        'Her journey represents thousands of youth with disabilities across India who are breaking systemic stereotypes. Equipped with accessible digital tools and corporate employer sensitization, she now mentors other aspiring trainees.'
      ]
    },
    'ayathur': {
      title: 'At Ayathur, Science Comes Alive',
      subtitle: 'Panchayat Union Middle School — Barrier-Free STEM Education',
      img: 'assets/story-science.jpg',
      badge: 'Inclusive Education',
      paragraphs: [
        'Just days after we set up a dedicated STEM lab at Panchayat Union Middle School in Ayathur, Headmistress Ms. Sathya Priya already has heartwarming stories to share with the community.',
        '“Before this inclusive lab, students with visual impairments and learning differences could only listen passively while other children conducted science experiments. With multi-sensory optical prisms, tactile anatomy models, and audio-narrated kits, our classroom has transformed.”',
        'CBM India has established over 80 accessible school laboratories across rural districts, proving that curiosity and scientific discovery belong equally to all children.'
      ]
    }
  };

  function openStoryModal(storyId) {
    const story = storyDetails[storyId];
    if (!story || !storyModalContent) return;

    storyModalContent.innerHTML = `
      <div class="modal-story-header">
        <span class="badge-tag">${story.badge}</span>
        <h3 id="storyModalTitle" class="modal-story-title">${story.title}</h3>
        <p style="color: #64748B; font-size: 0.9rem; margin-bottom: 16px;">${story.subtitle}</p>
      </div>
      <img src="${story.img}" alt="${story.title}" class="modal-story-img">
      <div class="modal-story-text">
        ${story.paragraphs.map(p => `<p>${p}</p>`).join('')}
      </div>
    `;

    storyModal.removeAttribute('hidden');
    requestAnimationFrame(() => {
      storyModal.classList.add('active');
      storyModalClose.focus();
    });
  }

  // Attach click to story read buttons
  document.querySelectorAll('.story-read-link, [data-story]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const storyId = btn.getAttribute('data-story');
      if (storyId) openStoryModal(storyId);
    });
  });

  if (storyModalClose) {
    storyModalClose.addEventListener('click', () => {
      storyModal.classList.remove('active');
      setTimeout(() => storyModal.setAttribute('hidden', ''), 200);
    });
  }

  /* ==========================================================================
     5. VIDEO MODAL INTERACTION
     ========================================================================== */
  const videoModal = document.getElementById('videoModal');
  const aboutVideoBtn = document.getElementById('aboutVideoBtn');
  const videoModalClose = document.getElementById('videoModalClose');

  if (aboutVideoBtn && videoModal) {
    aboutVideoBtn.addEventListener('click', () => {
      videoModal.removeAttribute('hidden');
      requestAnimationFrame(() => {
        videoModal.classList.add('active');
        if (videoModalClose) videoModalClose.focus();
      });
    });
  }

  if (videoModalClose && videoModal) {
    videoModalClose.addEventListener('click', () => {
      videoModal.classList.remove('active');
      setTimeout(() => videoModal.setAttribute('hidden', ''), 200);
    });
  }

  /* ==========================================================================
     6. QUICK DONATION PROTOTYPE MODAL & INTERACTIVE DONATION PASSAGE
     ========================================================================== */
  const donationModal = document.getElementById('donationModal');
  const donationModalClose = document.getElementById('donationModalClose');
  const donateNavBtn = document.getElementById('donateNavBtn');
  const amountPills = document.querySelectorAll('.amount-pill');
  const customAmountInput = document.getElementById('customAmountInput');
  const displayDonationAmount = document.getElementById('displayDonationAmount');
  const confirmDonationBtn = document.getElementById('confirmDonationBtn');

  // Interactive Homepage Donation Passage Elements
  const donationPassage = document.getElementById('donationPassage');
  const residenceBtns = document.querySelectorAll('.residence-btn');
  const causeChips = document.querySelectorAll('.cause-chip');
  const freqBtns = document.querySelectorAll('.freq-btn');
  const dynamicAmountGrid = document.getElementById('dynamicAmountGrid');
  const passageCustomAmount = document.getElementById('passageCustomAmount');
  const mirrorPhoto = document.getElementById('mirrorPhoto');
  const mirrorCategoryBadge = document.getElementById('mirrorCategoryBadge');
  const mirrorFreqLabel = document.getElementById('mirrorFreqLabel');
  const mirrorSum = document.getElementById('mirrorSum');
  const mirrorImpactTitle = document.getElementById('mirrorImpactTitle');
  const mirrorImpactNarrative = document.getElementById('mirrorImpactNarrative');
  const mirrorChecklist = document.getElementById('mirrorChecklist');
  const taxSavingAmount = document.getElementById('taxSavingAmount');
  const submitBtnAmount = document.getElementById('submitBtnAmount');
  const passageDonateSubmitBtn = document.getElementById('passageDonateSubmitBtn');

  // State
  let currentResidence = 'indian';
  let currentCause = 'health';
  let currentFreq = 'regular';
  let currentSelectedAmount = 5400;

  // Causes Configuration Data (Directly addressing user's requirement from uploaded screenshots)
  const causesData = {
    'health': {
      category: 'Inclusive Health',
      title: 'Make quality healthcare a reality for all',
      narrative: 'Your contribution directly funds sight-restoring cataract surgeries, clinical eye diagnostics, and comprehensive post-operative medication for individuals with disabilities in rural India.',
      photo: 'assets/impact-eye-care.jpg',
      checklist: [
        'Restores vision and prevents permanent avoidable blindness',
        'Includes custom assistive spectacles and diagnostic hospital care',
        'Covers patient transportation, food, and post-op rehabilitation'
      ],
      regularAmounts: [
        { amount: 900, label: 'Monthly' },
        { amount: 2700, label: 'Quarterly' },
        { amount: 5400, label: 'Half-Yearly', default: true },
        { amount: 10800, label: 'Annually' }
      ],
      onetimeAmounts: [
        { amount: 1500, label: 'Screening' },
        { amount: 3500, label: 'Assistive Device' },
        { amount: 7500, label: 'Surgery & Care', default: true },
        { amount: 15000, label: 'Community Clinic' }
      ]
    },
    'education': {
      category: 'Inclusive Education',
      title: 'Transform education and ensure no child is left behind',
      narrative: 'Your gift equips rural classrooms with tactile STEM models, audio-described materials, braille kits, and barrier-free learning tools for children with disabilities.',
      photo: 'assets/work-education.jpg',
      checklist: [
        'Accessible braille and audio-narrated STEM learning kits',
        'Specialized teacher training in universal design for learning',
        'Barrier-free school infrastructure and assistive learning tablets'
      ],
      regularAmounts: [
        { amount: 800, label: 'Monthly' },
        { amount: 2400, label: 'Quarterly', default: true },
        { amount: 4800, label: 'Half-Yearly' },
        { amount: 9600, label: 'Annually' }
      ],
      onetimeAmounts: [
        { amount: 1200, label: 'Learning Kit' },
        { amount: 3000, label: 'Assistive Tablet', default: true },
        { amount: 6000, label: 'Accessible Lab' },
        { amount: 12000, label: 'Classroom Fund' }
      ]
    },
    'livelihood': {
      category: 'Inclusive Livelihood',
      title: 'Create inclusive economic opportunities',
      narrative: 'Your support funds market-driven vocational certifications, digital skills at Parivarthan Academy, and starter capital for micro-enterprises run by youth with disabilities.',
      photo: 'assets/work-livelihood.jpg',
      checklist: [
        'Domestic IT helpdesk & retail sales course certification',
        'Micro-enterprise toolkits, inventory, and business mentorship',
        'Corporate disability-inclusive workplace placements and training'
      ],
      regularAmounts: [
        { amount: 1000, label: 'Monthly' },
        { amount: 3000, label: 'Quarterly', default: true },
        { amount: 6000, label: 'Half-Yearly' },
        { amount: 12000, label: 'Annually' }
      ],
      onetimeAmounts: [
        { amount: 2000, label: 'Starter Toolkit' },
        { amount: 5000, label: 'Skill Academy Term', default: true },
        { amount: 10000, label: 'Enterprise Grant' },
        { amount: 20000, label: 'Livelihood Hub' }
      ]
    },
    'sponsor': {
      category: 'Sponsor a Child',
      title: 'Become a sponsor and help children achieve their dreams',
      narrative: 'Your ongoing sponsorship provides a child with a disability holistic early intervention, specialized speech & physical therapy, nutritional care, and continuous schooling.',
      photo: 'assets/story-pranav.jpg',
      checklist: [
        'Personalized pediatric speech, motor, and occupational therapy',
        'Nutritional supplementary food and regular growth tracking',
        'School fees, accessible uniform, adaptive learning materials'
      ],
      regularAmounts: [
        { amount: 1200, label: 'Monthly Support', default: true },
        { amount: 3600, label: 'Quarterly Therapy' },
        { amount: 7200, label: 'Half-Year Care' },
        { amount: 14400, label: 'Full Year Care' }
      ],
      onetimeAmounts: [
        { amount: 2500, label: 'Specialist Therapy' },
        { amount: 5000, label: 'Nutritional Care', default: true },
        { amount: 10000, label: 'Therapy & School' },
        { amount: 25000, label: 'Annual Child Fund' }
      ]
    }
  };

  // Render the dynamic amount pills & mirror card
  function renderDonationPassage() {
    const causeInfo = causesData[currentCause] || causesData['health'];
    const amountTiers = currentFreq === 'regular' ? causeInfo.regularAmounts : causeInfo.onetimeAmounts;

    // Check if currentSelectedAmount is in the active tiers
    const hasCurrentAmount = amountTiers.some(t => t.amount === currentSelectedAmount);
    if (!hasCurrentAmount && !passageCustomAmount.value) {
      const defTier = amountTiers.find(t => t.default) || amountTiers[0];
      currentSelectedAmount = defTier.amount;
    }

    // Render 4 amount pills
    if (dynamicAmountGrid) {
      dynamicAmountGrid.innerHTML = '';
      amountTiers.forEach(tier => {
        const isSelected = tier.amount === currentSelectedAmount && !passageCustomAmount.value;
        const pillBtn = document.createElement('button');
        pillBtn.type = 'button';
        pillBtn.className = `dynamic-amount-pill ${isSelected ? 'active' : ''}`;
        pillBtn.setAttribute('role', 'radio');
        pillBtn.setAttribute('aria-checked', isSelected ? 'true' : 'false');
        pillBtn.innerHTML = `
          <strong>&#8377;${formatIndianNumber(tier.amount)}</strong>
          <span>${tier.label}</span>
        `;
        pillBtn.addEventListener('click', () => {
          passageCustomAmount.value = '';
          currentSelectedAmount = tier.amount;
          renderDonationPassage();
        });
        dynamicAmountGrid.appendChild(pillBtn);
      });
    }

    // Update Mirror Card Content
    if (mirrorPhoto) {
      mirrorPhoto.src = causeInfo.photo;
      mirrorPhoto.alt = `${causeInfo.category} impact still`;
    }
    if (mirrorCategoryBadge) mirrorCategoryBadge.textContent = causeInfo.category;
    if (mirrorFreqLabel) {
      mirrorFreqLabel.textContent = currentFreq === 'regular' ? 'Your Regular Pledge' : 'Your One-Time Gift';
    }
    if (mirrorSum) mirrorSum.textContent = `\u20B9${formatIndianNumber(currentSelectedAmount)}`;
    if (mirrorImpactTitle) mirrorImpactTitle.textContent = causeInfo.title;
    if (mirrorImpactNarrative) mirrorImpactNarrative.textContent = causeInfo.narrative;

    if (mirrorChecklist) {
      mirrorChecklist.innerHTML = causeInfo.checklist.map(item => `<li>${item}</li>`).join('');
    }

    if (taxSavingAmount) {
      if (currentResidence === 'indian') {
        const taxVal = Math.round(currentSelectedAmount * 0.30);
        taxSavingAmount.textContent = formatIndianNumber(taxVal);
        document.getElementById('mirrorTaxSaving').style.display = 'flex';
      } else {
        // NRI / Foreign donor
        document.getElementById('mirrorTaxSaving').style.display = 'none';
      }
    }

    if (submitBtnAmount) submitBtnAmount.textContent = formatIndianNumber(currentSelectedAmount);
  }

  // Event Listeners for Residence Toggle
  residenceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      residenceBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-checked', 'true');
      currentResidence = btn.getAttribute('data-residence');
      renderDonationPassage();
    });
  });

  // Event Listeners for Cause Chips
  causeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      causeChips.forEach(c => {
        c.classList.remove('active');
        c.setAttribute('aria-checked', 'false');
      });
      chip.classList.add('active');
      chip.setAttribute('aria-checked', 'true');
      currentCause = chip.getAttribute('data-cause');
      renderDonationPassage();
    });
  });

  // Event Listeners for Frequency Buttons
  freqBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      freqBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      currentFreq = btn.getAttribute('data-freq');
      renderDonationPassage();
    });
  });

  // Event Listener for Custom Amount Input
  if (passageCustomAmount) {
    passageCustomAmount.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      if (!isNaN(val) && val > 0) {
        currentSelectedAmount = val;
        // remove active from pills
        document.querySelectorAll('.dynamic-amount-pill').forEach(p => {
          p.classList.remove('active');
          p.setAttribute('aria-checked', 'false');
        });
        if (mirrorSum) mirrorSum.textContent = `\u20B9${formatIndianNumber(val)}`;
        if (submitBtnAmount) submitBtnAmount.textContent = formatIndianNumber(val);
        if (taxSavingAmount) taxSavingAmount.textContent = formatIndianNumber(Math.round(val * 0.30));
      }
    });
  }

  // Handle Passage Submit Button
  if (passageDonateSubmitBtn) {
    passageDonateSubmitBtn.addEventListener('click', () => {
      const causeInfo = causesData[currentCause];
      const freqText = currentFreq === 'regular' ? 'Regular monthly gift' : 'One-time gift';
      const residenceText = currentResidence === 'indian' ? 'Indian (80G Tax Exemption)' : 'Foreign/NRI Donor (FCRA)';
      
      // Sync with donation modal
      if (customAmountInput) customAmountInput.value = currentSelectedAmount;
      if (displayDonationAmount) displayDonationAmount.textContent = formatIndianNumber(currentSelectedAmount);
      openDonationModal();
    });
  }

  // Initialize Donation Passage
  renderDonationPassage();

  // Scroll smoothly to donation passage when clicking "Donate Now" anywhere
  function scrollToDonationPassage() {
    if (donationPassage) {
      donationPassage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      donationPassage.classList.add('focused-glow');
      setTimeout(() => {
        donationPassage.classList.remove('focused-glow');
      }, 1800);
    }
  }

  if (donateNavBtn) {
    donateNavBtn.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToDonationPassage();
    });
  }

  function openDonationModal() {
    if (!donationModal) return;
    donationModal.removeAttribute('hidden');
    requestAnimationFrame(() => {
      donationModal.classList.add('active');
      if (donationModalClose) donationModalClose.focus();
    });
  }

  if (donationModalClose) {
    donationModalClose.addEventListener('click', () => {
      donationModal.classList.remove('active');
      setTimeout(() => donationModal.setAttribute('hidden', ''), 200);
    });
  }

  // Handle amount pills inside modal
  amountPills.forEach(pill => {
    pill.addEventListener('click', () => {
      amountPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const val = pill.getAttribute('data-amount');
      if (customAmountInput) customAmountInput.value = val;
      if (displayDonationAmount) displayDonationAmount.textContent = formatIndianNumber(parseInt(val, 10));
    });
  });

  if (customAmountInput) {
    customAmountInput.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      if (!isNaN(val) && val > 0) {
        amountPills.forEach(p => {
          if (p.getAttribute('data-amount') === String(val)) {
            p.classList.add('active');
          } else {
            p.classList.remove('active');
          }
        });
        if (displayDonationAmount) displayDonationAmount.textContent = formatIndianNumber(val);
      }
    });
  }

  if (confirmDonationBtn) {
    confirmDonationBtn.addEventListener('click', () => {
      const causeTitle = causesData[currentCause].title;
      alert(`Thank you for supporting CBM India Trust!\n\nProgram: ${causeTitle}\nAmount: \u20B9${formatIndianNumber(currentSelectedAmount)}\nTax Status: 50% deduction under Section 80G.\n\nAn official 80G tax receipt will be sent to your registered email immediately.`);
      donationModal.classList.remove('active');
      setTimeout(() => donationModal.setAttribute('hidden', ''), 200);
    });
  }

  // Close modals on backdrop click
  [storyModal, videoModal, donationModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
          setTimeout(() => modal.setAttribute('hidden', ''), 200);
        }
      });
    }
  });

  function closeAllModals() {
    [storyModal, videoModal, donationModal].forEach(modal => {
      if (modal && modal.classList.contains('active')) {
        modal.classList.remove('active');
        setTimeout(() => modal.setAttribute('hidden', ''), 200);
      }
    });
  }

  /* ==========================================================================
     7. STICKY HEADER & MOBILE NAVIGATION
     ========================================================================== */
  const siteHeader = document.getElementById('site-header');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mainNav = document.getElementById('main-nav');

  window.addEventListener('scroll', () => {
    if (siteHeader) {
      if (window.scrollY > 40) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }
  });

  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', String(!isExpanded));
      mainNav.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (mainNav.classList.contains('active') && !mainNav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        mainNav.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Mobile & keyboard dropdown toggles
  const navDropdownToggles = document.querySelectorAll('.nav-item.has-dropdown .dropdown-toggle');
  navDropdownToggles.forEach(toggleBtn => {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const parentItem = toggleBtn.closest('.has-dropdown');
      if (parentItem) {
        const isOpen = parentItem.classList.contains('open');
        // Close siblings
        document.querySelectorAll('.nav-item.has-dropdown.open').forEach(item => {
          if (item !== parentItem) {
            item.classList.remove('open');
            const otherBtn = item.querySelector('.dropdown-toggle');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          }
        });
        parentItem.classList.toggle('open', !isOpen);
        toggleBtn.setAttribute('aria-expanded', String(!isOpen));
      }
    });
  });

  // Auto-close mobile drawer on link navigation
  const navActionLinks = mainNav ? mainNav.querySelectorAll('a') : [];
  navActionLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768 && mainNav && mainNav.classList.contains('active')) {
        mainNav.classList.remove('active');
        if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Secondary CTA buttons handling
  const heroLearnMoreBtn = document.getElementById('heroLearnMoreBtn');
  if (heroLearnMoreBtn) {
    heroLearnMoreBtn.addEventListener('click', () => {
      const aboutSection = document.getElementById('about');
      if (aboutSection) aboutSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  const heroDownloadFormBtn = document.getElementById('heroDownloadFormBtn');
  if (heroDownloadFormBtn) {
    heroDownloadFormBtn.addEventListener('click', () => {
      alert('Parivarthan Skills Academy Admission Form (PDF) is being prepared. Please send completed copies to vijay.kumar@cbmindia.org.');
    });
  }

  const loginBtn = document.getElementById('loginBtn');
  const mobileDrawerLoginBtn = document.getElementById('mobileDrawerLoginBtn');
  [loginBtn, mobileDrawerLoginBtn].forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        if (mainNav && mainNav.classList.contains('active')) {
          mainNav.classList.remove('active');
          if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
        alert('CBM India Partner & Supporter Portal login dialog.');
      });
    }
  });

  // Work Pillars exploration triggers
  document.querySelectorAll('[data-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-modal');
      alert(`Exploring CBM India's ${type.toUpperCase()} initiative: Detailed project portfolio, target districts, and community outcomes.`);
    });
  });

  // Get Involved triggers
  const openSponsorModalBtn = document.getElementById('openSponsorModalBtn');
  if (openSponsorModalBtn) {
    openSponsorModalBtn.addEventListener('click', () => {
      alert('Sponsor a Child Program: Connect with our child development team to provide inclusive education, therapeutic assistive devices, and nutritional support.');
    });
  }

  const openCsrModalBtn = document.getElementById('openCsrModalBtn');
  if (openCsrModalBtn) {
    openCsrModalBtn.addEventListener('click', () => {
      alert('CSR Partnership Inquiries: Align your corporate ESG and CSR goals with CBM India’s scalable, high-impact disability inclusion programs.');
    });
  }

  const openCareersModalBtn = document.getElementById('openCareersModalBtn');
  if (openCareersModalBtn) {
    openCareersModalBtn.addEventListener('click', () => {
      alert('Careers at CBM India: Explore opportunities in project management, inclusive health, field research, and advocacy across 25 Indian states.');
    });
  }

  // Story and news buttons
  const viewAllStoriesBtn = document.getElementById('viewAllStoriesBtn');
  const allStoriesCta = document.getElementById('allStoriesCta');
  [viewAllStoriesBtn, allStoriesCta].forEach(b => {
    if (b) b.addEventListener('click', () => openStoryModal('pranav'));
  });

  const allNewsHeaderBtn = document.getElementById('allNewsHeaderBtn');
  const allNewsBottomBtn = document.getElementById('allNewsBottomBtn');
  [allNewsHeaderBtn, allNewsBottomBtn].forEach(b => {
    if (b) b.addEventListener('click', () => {
      alert('CBM India Media Archive: Browsing featured press releases, white papers, and thought leadership articles.');
    });
  });

  document.querySelectorAll('[data-news]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-news');
      alert(`Opening featured publication article #${id} in reading mode.`);
    });
  });

});

/* ============================================================
   stats-auto.js — Auto-updates stat boxes
   Drop-in addon · Does NOT modify script.js or index.html logic
   ============================================================ */

   (function () {

    /* ── CONFIG: Set your career start date here ── */
    const CAREER_START = new Date('2024-12-04');
  
    /* ── Calculates years from start date to today ── */
    function getYearsExperience() {
      const ms    = Date.now() - CAREER_START.getTime();
      const years = ms / (1000 * 60 * 60 * 24 * 365.25);
      return Math.max(1, Math.floor(years));
    }
  
    /* ── Counts .project-card elements in DOM ── */
    function getProjectCount() {
      return document.querySelectorAll('.project-card').length;
    }
  
    /* ── Counts .skill-item elements in DOM ── */
    function getSkillCount() {
      return document.querySelectorAll('.skill-item').length;
    }
  
    let isPatching = false; // ← prevents MutationObserver infinite loop
  
    /* ── Patches data-target on all 4 stat boxes ── */
    function patchStatTargets() {
      if (isPatching) return;
      isPatching = true;
  
      const statEls = document.querySelectorAll('.count-up');
      if (statEls.length >= 4) {
        statEls[0].dataset.target = getYearsExperience(); // Years Experience
        statEls[1].dataset.target = getProjectCount();    // Projects Completed
        statEls[2].dataset.target = getSkillCount();      // Skills Mastered
        // statEls[3] → 100% Dev-Ready — left untouched
      }
  
      isPatching = false;
    }
  
    /* ── Run once DOM is ready, before observer fires ── */
    document.addEventListener('DOMContentLoaded', () => {
      patchStatTargets();
  
      /* ── Watch for new project cards or skill items added dynamically ── */
      const watcher = new MutationObserver((mutations) => {
        /* Only re-patch if actual project-card or skill-item nodes were added/removed */
        const relevant = mutations.some(m =>
          [...m.addedNodes, ...m.removedNodes].some(n =>
            n.nodeType === 1 && (
              n.classList?.contains('project-card') ||
              n.classList?.contains('skill-item')
            )
          )
        );
        if (relevant) patchStatTargets();
      });
  
      watcher.observe(document.body, { childList: true, subtree: true });
    });
  
  })();
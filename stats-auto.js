/* ============================================================
   stats-auto.js — Auto-updates stat boxes
   Drop-in addon · Does NOT modify script.js or index.html logic
   ============================================================ */

   (function () {

    /* ── CONFIG: Set your career start date here ── */
const CAREER_START = new Date('2024-12-04');  // ← change only this line
  
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
  
    /* ── Patches data-target on all 4 stat boxes ── */
    function patchStatTargets() {
      const statEls = document.querySelectorAll('.count-up');
      if (statEls.length < 4) return;
  
      statEls[0].dataset.target = getYearsExperience(); // Years Experience
      statEls[1].dataset.target = getProjectCount();    // Projects Completed
      statEls[2].dataset.target = getSkillCount();      // Skills Mastered
      // statEls[3] → 100% Dev-Ready — left untouched
    }
  
    /* ── Run once DOM is ready, before observer fires ── */
    document.addEventListener('DOMContentLoaded', patchStatTargets);
  
    /* ── Also watch for dynamically added project cards or skill items ──
       If you add a .project-card or .skill-item to the DOM later,
       this will re-patch the targets automatically                      ── */
    const watcher = new MutationObserver(() => patchStatTargets());
    document.addEventListener('DOMContentLoaded', () => {
      watcher.observe(document.body, { childList: true, subtree: true });
    });
  
  })();
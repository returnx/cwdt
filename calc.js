const CWDT_THRESHOLDS = [
     0,
     // lvl 1 to 10
     528, 583, 661, 725, 812, 897, 1003, 1107, 1221, 1354,
     // lvl 11 to 20
     1485, 1635, 1804, 1980, 2184, 2394, 2621, 2874, 3142, 3272,
     // lvl 21+
     3580, 3950, 4350, 4780, 5240, 5730, 6250, 6800, 7380, 7990
];

// This function shall run once after both the HTML and JavaScript finished loading
// It doesn't need to wait for images etc (as body.onLoad would do)
function init() {
     // All input elements shall trigger recalculation when changed
     for (const e of document.getElementsByTagName("input")) {
          e.addEventListener("change", checkEverything);
          e.addEventListener("input", checkEverything);
     }
     checkEverything();
}
if (document.readyState === "loading") {
     document.addEventListener("DOMContentLoaded", init);
} else {
     init();
}

// Collects all values entered into a <form>
function readFormElements(formid) {
     const values = {};
     const form = document.getElementById(formid);
     for (const input of form.elements) {
          if (!(input instanceof HTMLInputElement)) continue;
          if (input.type === "radio" && !input.checked) continue;
          const name = input.name;
          if (!name) continue;
          const value = Number(input.value);
          values[name] = value;
     }
     return values;
}

function output(elementname, contents, color) {
     const e = document.getElementById(elementname);
     if (!e) return;
     if (typeof contents === 'number') {
          // If this is a number, round down to two decimal places
          contents = Math.floor(contents * 100) / 100;
     }
     e.innerText = contents;
     if (color) {
          e.style.color = color;
          e.style.fontWeight = "900";
     }
     else {
          e.style.color = "";
          e.style.fontWeight = "";
     }
}

function checkEverything() {
     checkLoop();
     checkFlask();
}

// Calculates whether the loop works
function checkLoop() {
     const {
          forbiddenRite,
          life,
          energyShield,
          chaosRes,
          ringCount,
          ringDamage,
          SummonSkeletonLevel,
          CWDTLevel,
          CWDTQuality,
          ward
     } = readFormElements("loopForm");

     let skeletonCount = 2;
     if (SummonSkeletonLevel >= 11) skeletonCount++;
     if (SummonSkeletonLevel >= 21) skeletonCount++;
     if (SummonSkeletonLevel >= 31) skeletonCount++;

     let healthlost = 0;

     const oneSkeletonDamage = ringCount * ringDamage;
     const skeletonDamage = oneSkeletonDamage * skeletonCount;
     output("skelDamage", skeletonDamage);
     output("skelDamage2", skeletonCount);
     if (oneSkeletonDamage > ward) {
          healthlost += (oneSkeletonDamage - ward) * skeletonCount;
          output("skelDamage3", oneSkeletonDamage, "yellow");
     } else {
          output("skelDamage3", oneSkeletonDamage);
     }

     const frDamage = forbiddenRite * (life * 0.4 + energyShield * 0.25) * (1 - (chaosRes / 100));
     if (frDamage > ward) {
          healthlost += (frDamage - ward);
          output("frDamage", frDamage, "yellow");
     } else {
          output("frDamage", frDamage);
     }

     const totalDamage = skeletonDamage + frDamage;

     const gemMulti = Math.floor(CWDTQuality / 2);
     const threshold = CWDT_THRESHOLDS[CWDTLevel] * (1 - gemMulti / 100);

     output("totalDamage2", threshold);

     if (totalDamage >= threshold) {
          output("totalDamage", totalDamage);
          output("status", "LOOP WORKS", "lime");
     } else {
          output("totalDamage", totalDamage, "red");
          output("status", "LOOP FAILS", "red");
     }

     if (healthlost > 500) {
          output("healthlost", healthlost, "red");
     } else if (healthlost > 0) {
          output("healthlost", healthlost, "yellow");
     } else {
          output("healthlost", "NONE", "lime");
     }

     const incDmgTaken_skel = ward / oneSkeletonDamage;
     const incDmgTaken_fr = ward / frDamage;
     const incDmgTaken = Math.min(incDmgTaken_skel, incDmgTaken_fr) - 1;
     const incDmgTaken_percent = Math.floor(incDmgTaken * 100);
     if (incDmgTaken >= 0) {
          output("incDmgTaken", incDmgTaken_percent + "%");
     }
     else {
          output("incDmgTaken", "none", "yellow");
     }
}

// Calculates flask uptime
function checkFlask() {
     const {
          ascCharges,    // checking if scion/pathfinder
          flaskCount,    // 2-3-4
          charms,        // charm count
          charges,       // total charges gained
          duration,      // total flask duration
          reduced,       // reduced flask charges used modifier
          olduration,    // olroth's duration
          olused,        // olroths's charges used 
     } = readFormElements("flaskForm");

     var flaskMultiplier = 5 - flaskCount; // balbala multiplier, this calculator assumes balbala
     var chargesConsumed = olused * (1 - (reduced/100));

     var currentCharges = 60 - chargesConsumed; // Olroth's flask has 60 charges, so we start

     var totalDuration = parseInt((olduration * (1 + (duration / 100))) * 1000);

     output("fstatus", "FLASKS WORK!", "lime"); // We assume flask work
     // We check if flask will sustain for 10 minutes. The time here is in milliseconds

     for(var i = 1; i < 10 * 60 * 1000; i++) {

          if(i % 3000 === 0) {
               currentCharges = currentCharges + ((ascCharges * 3 + charms) * (1 + (charges/100)));
          }

          if(i % 5000 === 0) {
               currentCharges = currentCharges + ((4 * flaskMultiplier) * (1 + (charges/100)));
          }

          if(i % totalDuration === 0) {
               if(currentCharges >= chargesConsumed) {
                    currentCharges = currentCharges - chargesConsumed;
               } else {
                    output("fstatus", "FLASKS FAIL", "red");
                    break;
               }
          }

     }

     // (((8/5)+(1/3)+(3/3))*(1+(R1/100))+0.075) / (R5*(1-R3/100)/(R4*(1+(R2/100))))
     var fCoefficient = (((4 * flaskMultiplier / 5) + ascCharges + charms / 3) * (1 + (charges / 100)) + 0.075) / (olused * (1 - reduced / 100) / (olduration * (1 + (duration / 100))));
     output("fCoefficient", fCoefficient);
}

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

     let skeletonDamage = ringCount * ringDamage * skeletonCount;
     document.getElementById("skelDamage").innerHTML = skeletonDamage;

     let frDamage = forbiddenRite * (life * 0.4 + energyShield * 0.25) * (1 - (chaosRes / 100));
     document.getElementById("frDamage").innerHTML = frDamage;

     let totalDamage = skeletonDamage + frDamage;
     document.getElementById("totalDamage").innerHTML = totalDamage;

     let threshold = CWDT_THRESHOLDS[CWDTLevel];
     let gemMulti = Math.floor(CWDTQuality / 2);
     threshold = threshold * (1 - gemMulti / 100);

     // if(parseInt(SummonSkeletonLevel) > gLevel) {
     //     gLevel = parseInt(SummonSkeletonLevel);
     // }
     // We will handle this case later, perhaps only the bot will support it


     let status = false;

     if (totalDamage >= threshold) { status = true }

     if (status == true) {
          document.getElementById("status").innerHTML = "LOOP WORKS";
          document.getElementById("status").style.color = "lime";
          document.getElementById("status").style.fontWeight = "900";

     } else {
          document.getElementById("status").innerHTML = "LOOP FAILS";
          document.getElementById("status").style.color = "red";
          document.getElementById("status").style.fontWeight = "900";
     }

     if (ward >= frDamage) {
          document.getElementById("wardfr").innerHTML = "YES";
          document.getElementById("wardfr").style.color = "lime";
          document.getElementById("wardfr").style.fontWeight = "900";
     } else {
          document.getElementById("wardfr").innerHTML = "NO";
          document.getElementById("wardfr").style.color = "yellow";
          document.getElementById("wardfr").style.fontWeight = "900";
     }
}

// Calculates flask uptime
function checkFlask() {
     const {
          ascCharges,
          flaskCount,
          charms,
          charges,
          duration,
          reduced,
          olduration,
          olused,
     } = readFormElements("flaskForm");

     var flaskMultiplier = 5 - flaskCount;

     // (((8/5)+(1/3)+(3/3))*(1+(R1/100))+0.075) / (R5*(1-R3/100)/(R4*(1+(R2/100))))

     var result = (((4 * flaskMultiplier / 5) + ascCharges + charms / 3) * (1 + (charges / 100)) + 0.075) / (olused * (1 - reduced / 100) / (olduration * (1 + (duration / 100))));
     if (result > 1.02) {
          document.getElementById("fstatus").innerHTML = "FLASKS WORK!";
          document.getElementById("fstatus").style.color = "lime";
          document.getElementById("fstatus").style.fontWeight = "900";

     } else {
          document.getElementById("fstatus").innerHTML = "FLASKS FAIL";
          document.getElementById("fstatus").style.color = "red";
          document.getElementById("fstatus").style.fontWeight = "900";
     }

     document.getElementById("fCoefficient").innerHTML = result;
}

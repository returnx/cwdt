const myTimeout = setInterval(checkLoop, 100);

function checkLoop() {
     const life = document.getElementById("life").value;
     const energyShield = document.getElementById("energyShield").value;
     const chaosRes = document.getElementById("chaos").value;

     const ringCount1 = document.getElementById("ringCount1").checked;

     let ringMultiplier;
     if (ringCount1 == true) {
          ringMultiplier = 1;
     } else {
          ringMultiplier = 2;
     }

     // const isDivergent = document.getElementById("typeDivergent").checked
     const gemQuality = document.getElementById("CWDTQuality").value;
     const gemLevel = document.getElementById("CWDTLevel").value;
     const ringDamage = document.getElementById("ringDamage").value;
     const SummonSkeletonLevel = document.getElementById("SummonSkeletonLevel").value;
     let skeletonCount = 2;
     if (SummonSkeletonLevel >= 11) skeletonCount++;
     if (SummonSkeletonLevel >= 21) skeletonCount++;
     if (SummonSkeletonLevel >= 31) skeletonCount++;

     let skeletonDamage = ringMultiplier * ringDamage * skeletonCount;
     document.getElementById("skelDamage").innerHTML = skeletonDamage;

     let frDamage = (life * 0.4 + energyShield * 0.25) * (1 - (chaosRes / 100));
     document.getElementById("frDamage").innerHTML = frDamage;

     let totalDamage = skeletonDamage + frDamage;
     document.getElementById("totalDamage").innerHTML = totalDamage;

     let threshold;
     let status = false;
     let gLevel = parseInt(gemLevel);

     // if(parseInt(SummonSkeletonLevel) > gLevel) {
     //     gLevel = parseInt(SummonSkeletonLevel);
     // }
     // We will handle this case later, perhaps only the bot will support it

     switch (gLevel) {
          case 1: threshold = 528; break;
          case 2: threshold = 583; break;
          case 3: threshold = 661; break;
          case 4: threshold = 725; break;
          case 5: threshold = 812; break;
          case 6: threshold = 897; break;
          case 7: threshold = 1003; break;
          case 8: threshold = 1107; break;
          case 9: threshold = 1221; break;
          case 10: threshold = 1354; break;
          case 11: threshold = 1485; break;
          case 12: threshold = 1635; break;
          case 13: threshold = 1804; break;
          case 14: threshold = 1980; break;
          case 15: threshold = 2184; break;
          case 16: threshold = 2394; break;
          case 17: threshold = 2621; break;
          case 18: threshold = 2874; break;
          case 19: threshold = 3142; break;
          case 20: threshold = 3272; break;
          case 21: threshold = 3580; break;
          case 22: threshold = 3950; break;
          case 23: threshold = 4350; break;
          default: threshold = 3580; // level 21
     }

     let gemMulti = Math.floor(gemQuality / 2);
     threshold = threshold * (1 - gemMulti / 100);


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

     const ward = document.getElementById("Ward").value;

     if (ward >= frDamage) {
          document.getElementById("wardfr").innerHTML = "YES";
          document.getElementById("wardfr").style.color = "lime";
          document.getElementById("wardfr").style.fontWeight = "900";
     } else {
          document.getElementById("wardfr").innerHTML = "NO";
          document.getElementById("wardfr").style.color = "yellow";
          document.getElementById("wardfr").style.fontWeight = "900";
     }

     // Flask math

     const asc = document.getElementById("others").checked;
     var chargesGained = document.getElementById("charges").value;
     var duration = document.getElementById("duration").value;
     var reduced = document.getElementById("reduced").value;
     var olduration = document.getElementById("olduration").value;
     var olused = document.getElementById("olused").value;
     var charms = document.getElementById("charms").value

     chargesGained = parseInt(chargesGained);
     duration = parseInt(duration);
     reduced = parseInt(reduced);
     olduration = parseFloat(olduration);
     olused = parseInt(olused);

     var flaskCount = 0;
     var flask2 = document.getElementById("2flask").checked;
     var flask3 = document.getElementById("3flask").checked;
     var flask4 = document.getElementById("4flask").checked;

     if (flask2 == true) flaskCount = 2;
     if (flask3 == true) flaskCount = 3;
     if (flask4 == true) flaskCount = 4;

     var flaskMultiplier = 5 - flaskCount;

     // (((8/5)+(1/3)+(3/3))*(1+(R1/100))+0.075) / (R5*(1-R3/100)/(R4*(1+(R2/100))))

     var ascCharges;
     if (asc == true) {
          ascCharges = 0;
     } else {
          // pathfinder
          ascCharges = 1;
     }

     var result = (((4 * flaskMultiplier / 5) + ascCharges + charms / 3) * (1 + (chargesGained / 100)) + 0.075) / (olused * (1 - reduced / 100) / (olduration * (1 + (duration / 100))));
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

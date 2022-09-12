const myTimeout = setInterval(checkLoop, 100);

function checkLoop() {
    const life = document.getElementById("life").value;
    const energyShield = document.getElementById("energyShield").value;
    const chaosRes = document.getElementById("chaos").value;

    const ringCount1 =  document.getElementById("ringCount1").checked;
    let ringMultiplier;
    if(ringCount1==true) {
        ringMultiplier = 1;
    } else {
        ringMultiplier = 2;
    }

    const isDivergent = document.getElementById("typeDivergent").checked
    const gemQaulity = document.getElementById("CWDTQuality").value;
    const gemLevel = document.getElementById("CWDTLevel").value;
    const ringDamage = document.getElementById("ringDamage").value;
    const SummonSkeletonLevel = document.getElementById("SummonSkeletonLevel").value;
    let skeletonCount = 3;
    if(SummonSkeletonLevel == 21)  {
        skeletonCount = 4;
    }

    let skeletonDamage = ringMultiplier * ringDamage * skeletonCount;
    document.getElementById("skelDamage").innerHTML= skeletonDamage ;

    let frDamage = (life * 0.4 + energyShield * 0.25) * (1-(chaosRes/100));
    document.getElementById("frDamage").innerHTML= frDamage ;

    let totalDamage = skeletonDamage + frDamage;
    document.getElementById("totalDamage").innerHTML= totalDamage ;

    let threshold;
    let status =false;
    let gLevel = parseInt(gemLevel);

    switch(gLevel) {
        case 21:
            threshold = 3580;
            break;
        case 22:
            threshold = 3950;
            break;
        case 23:
            threshold = 4350;
            break;
        default:
            threshold = 3580;
    }

    if(isDivergent) {
        threshold = threshold * (1-gemQaulity/100);
    }

    if(totalDamage >= threshold) {status = true}

    if(status == true) {
        document.getElementById("status").innerHTML= "LOOP WORKS";
        document.getElementById("status").style.color = "lime";
        document.getElementById("status").style.fontWeight = "900";

    } else {
        document.getElementById("status").innerHTML= "LOOP FAILS";
        document.getElementById("status").style.color = "red";
        document.getElementById("status").style.fontWeight = "900";
   }

   // Flask math

   const asc =  document.getElementById("others").checked;
   var chargesGained = document.getElementById("charges").value;
   var duration = document.getElementById("duration").value;
   var reduced = document.getElementById("reduced").value;
   var olduration = document.getElementById("olduration").value;
   var olused = document.getElementById("olused").value;

   chargesGained = parseInt(chargesGained);
   duration = parseInt(duration);
   reduced = parseInt(reduced);
   olduration = parseFloat(olduration);
   olused = parseInt(olused);

   var flaskCount=0;
   var flask2 = document.getElementById("2flask").checked;
   var flask3 = document.getElementById("3flask").checked;
   var flask4 = document.getElementById("4flask").checked;

   if(flask2 ==true) flaskCount = 2;
   if(flask3 ==true) flaskCount = 3;
   if(flask4 ==true) flaskCount = 4;

   var flaskMultiplier = 5 - flaskCount;

   // (((8/5)+(1/3)+(3/3))*(1+(R1/100))+0.075) / (R5*(1-R3/100)/(R4*(1+(R2/100)))) 

   var ascCharges;
   if(asc == true) {
        ascCharges = 0;
   } else {
        // pathfinder
        ascCharges = 1;
   }

   var result = (((4*flaskMultiplier/5)+(1/3)+ascCharges)*(1+(chargesGained/100))+0.075) / (olused*(1-reduced/100)/(olduration*(1+(duration/100))));
   if(result > 1.03 ) {
        document.getElementById("fstatus").innerHTML= "FLASKS WORK!";
        document.getElementById("fstatus").style.color = "lime";
        document.getElementById("fstatus").style.fontWeight = "900";

   } else {
            document.getElementById("fstatus").innerHTML= "FLASKS FAIL";
            document.getElementById("fstatus").style.color = "red";
            document.getElementById("fstatus").style.fontWeight = "900";
   }

   document.getElementById("fCoefficient").innerHTML= result;
}

// take in name of one npc, biome, and neighbours (list of names of npcs)
// return happiness of the one npc (pricing modifier) multiplied by the npc's weight
function oneHappiness(name, biome, neighbours) {
  let happ = 1.0
  let npc = npcdict[name]
  
  // crowdedness
  if (neighbours.length > 3) {
    happ *= 1.05 ** (neighbours.length - 3)
  } else {
    happ *= 0.95
  }

  // right biome
  if (biome === npc["biome_liked"]) {
    // too lazy to make "biome_loved/hated" just for santa
    if (name === "Santa Claus") {
      happ *= 0.88
    } else {
      happ *= 0.94
    }
  }

  // wrong biome
  if (biome === npc["biome_disliked"]) {
    if (name === "Santa Claus") {               
      happ *= 1.12
    } else {           
      happ *= 1.06
    } 
  }

  // neighbours
  for (const n of neighbours) {
    if (npc["loves"].includes(n))    { happ *= 0.88 }
    if (npc["likes"].includes(n))    { happ *= 0.94 }
    if (npc["dislikes"].includes(n)) { happ *= 1.06 }
    if (npc["hates"].includes(n))    { happ *= 1.12 }
  }

  // round to 2dp
  // weighting is how much we care about that npc
  return +happ.toFixed(2) * npc["weighting"]
}

// input group of names of npcs
// return array of the biome(s) which minimise happiness
function bestBiomesForGroup(group) {
  let lowestHappinessSoFar = Infinity
  let bestBiomesSoFar = []
  for (const biome of biomes) {
    let thisBiomeHappiness = 0.0
    for (const person of group) {
      thisBiomeHappiness += oneHappiness(person, biome,
        group.filter((name,index) => name !== person))
    }
    if (thisBiomeHappiness < lowestHappinessSoFar) {
      bestBiomesSoFar = [biome]
      lowestHappinessSoFar = thisBiomeHappiness
    } else if (thisBiomeHappiness === lowestHappinessSoFar) {
      bestBiomesSoFar.push(biome)
    }
  }
  return bestBiomesSoFar
}

// input group of names of npcs
// return the average happiness of these npcs (divide by sum of weighting)
// each npc has all the other ones as neigbours
// automatically chooses biome that minimises happiness
function groupHappiness(group) {
  // dont care which biome, so just pick first returned one
  let biome = bestBiomesForGroup(group)[0]
  let sumOfWeights = 0.0
  let thisGroupHappiness = 0.0
  
  for (const person of group) {
    thisGroupHappiness += oneHappiness(person, biome,
      group.filter((name,index) => name !== person))
    sumOfWeights += npcdict[person]["weighting"]
  }


  return thisGroupHappiness / sumOfWeights
}
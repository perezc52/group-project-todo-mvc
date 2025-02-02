//js folder, main.js

//ParticlesJS- js package for floating particle stars
particlesJS("particles-js", {"particles":{"number":{"value":10,"density":{"enable":true,"value_area":800}},"color":{"value":"#ffffff"},"shape":{"type":"star","stroke":{"width":0,"color":"#000000"},"polygon":{"nb_sides":5},"image":{"src":"img/github.svg","width":100,"height":100}},"opacity":{"value":1,"random":false,"anim":{"enable":true,"speed":0.9589796456570205,"opacity_min":0.07192347342427655,"sync":true}},"size":{"value":1.3,"random":true,"anim":{"enable":false,"speed":3000,"size_min":0.1,"sync":false}},"line_linked":{"enable":false,"distance":994.3417221051627,"color":"#ffffff","opacity":0.4,"width":1},"move":{"enable":true,"speed":1,"direction":"none","random":true,"straight":false,"out_mode":"out","bounce":false,"attract":{"enable":false,"rotateX":600,"rotateY":1200}}},"interactivity":{"detect_on":"canvas","events":{"onhover":{"enable":true,"mode":"repulse"},"onclick":{"enable":true,"mode":"push"},"resize":false},"modes":{"grab":{"distance":400,"line_linked":{"opacity":1}},"bubble":{"distance":400,"size":40,"duration":2,"opacity":8,"speed":3},"repulse":{"distance":200,"duration":0.4},"push":{"particles_nb":4},"remove":{"particles_nb":2}}},"retina_detect":true});

const deleteBtn = document.querySelectorAll('#delete')
const todoItem = document.querySelectorAll('span.not')//creating a variable and assigning it a nodelist of spans with a NOT class
const todoComplete = document.querySelectorAll('span.favorite')//creating a variable and assigning it a nodelist of spans with a FAVORITE class

// ======= changed del class to delete id in ejs
// const deleteBtn = document.querySelectorAll('.del')
// const todoItem = document.querySelectorAll('span.not')
// const todoComplete = document.querySelectorAll('span.completed')


document.querySelector('#poke-search').addEventListener('click', getPokemon)


  async function getPokemon(){
    const choice = document.querySelector('#poke-name').value.trim().toLowerCase() //cleans up whatever the user input
    console.log(choice)
  
    const url = `https://pokeapi.co/api/v2/pokemon/${choice}`
    const urlForDesc = `https://pokeapi.co/api/v2/pokemon-species/${choice}/`

    const data = await fetch(url).then(res => res.json()).catch(err=>{document.querySelector('.name').innerText = "Pokemon not found. Please try again."})
    const descData = await fetch(urlForDesc).then(res => res.json()).catch(err=>{document.querySelector('.name').innerText = "Pokemon not found. Please try again."})
    
    //poke api fetch

    console.log(`full data from poke api`,data)

    const pokemon = new Poke(data.species.name, //we're making a new pokemon object using the class Poke constructor which is below under the fetch
            data.height,
            data.weight,
            data.types,
            data.sprites.other["official-artwork"].front_default,
            data.abilities[0].ability.name,
            data.moves,
            descData.description
    )  

    pokemon.getTypes(data.types)
    pokemon.getAttacks(data.moves)
    pokemon.getDescription(descData.flavor_text_entries)

    document.querySelector('.name').innerText = pokemon.name
    document.querySelector('.height').innerText = `${pokemon.height/10} meters` // divided by 10 due to the weird units pokeapi uses
    document.querySelector('.weight').innerText = `${pokemon.weight/10} kilograms`
    document.querySelector('.type').innerText=pokemon.types.join(', ')
    document.querySelector('img').src = pokemon.image
    document.querySelector('.ability').innerText=pokemon.ability
    document.querySelector('.attacks').innerText=pokemon.attacks.join(', ')
    document.querySelector('.description').innerText=pokemon.description
  
    console.log(`pokemon is to send to server `, pokemon)  
    
    
    const uploadResult = await fetch("/todos/createTodo", {
        method: "post",
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(pokemon)
    })

   location.reload()
    console.log(pokemon)
    console.log(data)
    console.log(descData)
    // fetch(url)
    //     .then(res => res.json()) // parse response as JSON
    //     .then(async data => {
    //       console.log(data)
    //       console.log(data.moves)
  
    //        pokemon= new Poke(data.species.name, //we're making a new pokemon object using the class Poke constructor which is below under the fetch
    //                               data.height,
    //                               data.weight,
    //                               data.types,
    //                               data.sprites.other["official-artwork"].front_default,
    //                               data.abilities[0].ability.name,
    //                               data.moves
    //                            )    //name, height, weight, type, picture (sprite),ability 1, type
  
    //       pokemon.getTypes(data.types)
    //       pokemon.getAttacks(data.moves)
    //       document.querySelector('.name').innerText = pokemon.name
    //       document.querySelector('.height').innerText = `${pokemon.height/10} meters` // divided by 10 due to the weird units pokeapi uses
    //       document.querySelector('.weight').innerText = `${pokemon.weight/10} kilograms`
    //       document.querySelector('.type').innerText=pokemon.types
    //       document.querySelector('img').src = pokemon.image
    //       document.querySelector('.ability').innerText=pokemon.ability
    //       document.querySelector('.attacks').innerText=pokemon.attacks
        
    //       console.log(`pokemon is `, pokemon)               
    //     })
        // .then(()=>{
        //     //post to server the pokemon 
        //     fetch("/todos/createTodo", {
        //         method: "post",
        //         headers: {'Content-Type':'application/json'},
        //         body: JSON.stringify(pokemon)
        //     })
        // })
        //then reload after sending to server
        // .then(()=> location.reload())

       
        
        // .catch(err => {
        //     console.log(`error ${err}`)
        //     document.querySelector('.error').innerText = `Pokemon not found. Please try again.`
        // });


        

  }
  
  class Poke {
    constructor (name, height, weight, types, image, ability, attacks) { //the order that the parameters here must be the same order as the parameters in const pokemon= new Poke (this is located above in the fetch and it calls this class constructor)
  
                                                          //the pokemon name is listed first here in the constructor, and so the "data.species.name" parameter is listed first in the new Poke object above, which calls this class constructor
      this.name = name
      this.height = height
      this.weight = weight
      this.types = []
      this.image = image
      this.ability =ability
      this.attacks = []
    }
      getTypes(arr) {
        if(arr.length == 2) {
          this.types.push(arr[0].type.name)
          this.types.push(arr[1].type.name)
        }else {
          this.types.push(arr[0].type.name)
        }
      }
  
      getAttacks(arr) {
        for(let i = arr.length-1; i >= 0; i--) {
          if(arr[i].version_group_details[0].move_learn_method.name === "level-up" && this.attacks.length < 4) {
            this.attacks.push(arr[i].move.name)
          }
        }
      }

      getDescription(arr) {
        let shortestDesc = arr.filter(el => el.language.name === "en")
                              .reduce((a, b) => a.length <= b.length ? a : b)
        this.description = shortestDesc.flavor_text
        // for(let i = arr.length-1; i >= 0; i--) {
        //   if(arr[i].language.name === "en" && arr[i].flavor_text.length < 125) this.description = arr[i].flavor_text
        // }
      }
  
  
  }

// ========================================
// ORIG BELOW
// ========================================

// >>>>>>> b688fee94f7d1fc83dc8fb149a130516cb1f0501
Array.from(deleteBtn).forEach((el)=>{
    el.addEventListener('click', deleteTodo)
})

Array.from(todoItem).forEach((el)=>{
    el.addEventListener('click', markFavorite)  //event listener for markFavorite 
    //since todoItem is a nodeList we need to turn it into an array
})

Array.from(todoComplete).forEach((el)=>{
    el.addEventListener('click', markNotFavorite)  //event listener for markNotFavorite 
})

async function deleteTodo(){
    const todoId = this.parentNode.dataset.id
    try{
        const response = await fetch('todos/deleteTodo', {
            method: 'delete',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'todoIdFromJSFile': todoId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

async function markFavorite(){
    const todoId = this.parentNode.dataset.id
    try{
        const response = await fetch('todos/markFavorite', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'todoIdFromJSFile': todoId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

async function markNotFavorite(){
    const todoId = this.parentNode.dataset.id
    try{
        const response = await fetch('todos/markNotFavorite', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'todoIdFromJSFile': todoId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}


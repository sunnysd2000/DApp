

App={
  contracts:{},
  loading:false,
    load:async()=>{
        //load app
        await App.loadWeb3()
        await App.loadAccount()
        await App.loadContract()
        await App.render()
        //console.log("app loading...")
    },
    loadWeb3: async () => {
        if (typeof web3 !== 'undefined') {
          App.web3Provider = web3.currentProvider
          web3 = new Web3(web3.currentProvider)
        } else {
          window.alert("Please connect to Metamask.")
        }
        // Modern dapp browsers...
        if (window.ethereum) {
          window.web3 = new Web3(ethereum)
          try {
            // Request account access if needed
            await ethereum.enable()
            // Acccounts now exposed
            web3.eth.sendTransaction({/* ... */})
          } catch (error) {
            // User denied account access...
          }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
          App.web3Provider = web3.currentProvider
          window.web3 = new Web3(web3.currentProvider)
          // Acccounts always exposed
          web3.eth.sendTransaction({/* ... */})
        }
        // Non-dapp browsers...
        else {
          console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
      },
      loadAccount: async () => {
        // Set the current blockchain account
        App.account = web3.eth.accounts[0]
        console.log(App.account)



      },
      loadContract:async()=>{
        //var contract = require("truffle-contract");
        const evidences=await $.getJSON('Evidences.json')
        App.contracts.Evidences=TruffleContract(evidences)
        App.contracts.Evidences.setProvider(App.web3Provider)
        console.log(evidences)

        App.evidences=await App.contracts.Evidences.deployed()

      },
      render:async()=>{
        if (App.loading) {
          return
        }
    
        App.setLoading(true)
    
        $('#account').html(App.account)
    
        await App.renderTasks()
    
        App.setLoading(false)
      },
      renderTasks: async () =>{
        // Load the total task count from the blockchain
        const taskCount = await App.evidences.ecount()
        const $taskTemplate = $('.taskTemplate')
    
        // Render out each task with a new task template
        for (var i = 1; i <= taskCount; i++) {
          // Fetch the task data from the blockchain
          const task = await App.evidences.evidarray(i)
          const caseno = task[0].toNumber()
          const evid = task[1].toNumber()
          const data = task[2]
          const owner =task[3]
    
          // Create the html for the task
          // const $newTaskTemplate = $taskTemplate.clone()
          // $newTaskTemplate.find('.content').html(data)
          // $newTaskTemplate.find('input')
          //                 .prop('name', caseno)
          //                 .prop('checked', evid)
          //                 .prop('owner',owner)
                          // .on('click', App.toggleCompleted)
    
          // Put the task in the correct list
          
          // if (taskCompleted) {
          //   $('#completedTaskList').append($newTaskTemplate)
          // } else {
          //   $('#taskList').append($newTaskTemplate)
          // }
    
          // Show the task
          //$newTaskTemplate.show()
          if ($("#evidenceTable tbody").length == 0) {
            $("#evidenceTable").append("<tbody></tbody>");
        }
    
        // Append product to the table
        $("#evidenceTable tbody").append("<tr>" +
            "<td>" + caseno + "</td>" +
            "<td>" + evid+ "</td>" +
            "<td>" + data + "</td>" +
            "<td>" + owner + "</td>" +
            "</tr>");
    }
      },

      ipfsClient:async()=>{
        const ipfs= await create({
          host:"ipfs.infura.io",
          port:5001,
          protocol:"https"
        });
        return ipfs

      },
      saveText:async()=>{
        let ipfs=await ipfsClient();
        let result=ipfs.add("hello");
        console.log(result)
      },
      createEvidence: async () => {
        App.setLoading(true)
        const caseno = $('#caseno').val()
        const evid = $('#evid').val()
        const data = $('#data').val()
        const owner = $('#owner').val()

        await App.evidences.createEvidence(caseno,evid,data,owner,{from:App.account})
        window.location.reload()
      },

      // toggleCompleted: async (e) => {
      //   App.setLoading(true)
      //   const taskId = e.target.name
      //   await App.todolist.toggleCompleted(taskId,{from:App.account})
      //   window.location.reload()
      // },
      setLoading: (boolean) => {
        App.loading = boolean
        const loader = $('#loader')
        const content = $('#content')
        if (boolean) {
          loader.show()
          content.hide()
        } else {
          loader.hide()
          content.show()
        }
      }
    
}

 $(()=>{
     $(window).load(()=>{
         App.load()
     })
 })


var Contract = require('web3-eth-contract');
const Tx = require('ethereumjs-tx').Transaction;
const Web3 = require('web3');
var solc = require("solc"); //contract Compile
var fs = require("fs"); //file 시스템
// const web3 = new Web3(new Web3.providers.HttpProvider('https://kovan.infura.io/v3/f4c65e7a8dac44a581100fe538f995cc'));
// const web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed1.binance.org:443"));
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));

const sendAccount = '0xB970a169782e820ddD14Bf4fb44e0bEDc4775156';
const privateKey = Buffer.from('f30a87bcd9a02e8a085de768b4eb92006767bb6ccd58ba019675c84aab87cea8', 'hex');
const receiveAccount = '0xB2107e6F428Fa0Fb091dB4C7805D4048A9B5e11D';

const metaCoinAddress = '0xFCd220014fa8A4F22dE0BAA2a46e932BAf423A90';
const convertLibAddress = '0xBC0c6E12184B97A3b212360546c90bD614C4F408';


test();

function test() {
  // getContracts("./build/contracts/MetaCoin.json");
  metaContract("./build/contracts/MetaCoin.json", metaCoinAddress);
    // metaContract2("./build/contracts/MetaCoin.json");
    // convertLibContract(
    //     "./build/contracts/ConvertLib.json",
    //     "0x49C8dE2a75A8c56EbEDccFA952Fa0a33930e27eB",
    //     1,
    //     2
    // ); // OKay 정상작동!!
    // doContract(
    //     "./build/contracts/DOCHI.json",
    //     "0xeA2f5B97145032f8bD2D504e3C0A86c982012F20"
    // ); // OKay 정상작동!!
    //
    // deploy("./build/contracts/DOCHI.json");
    // allProcess();
    // sendETH();
    // getAccounts();
    // getBalance('0x7B6Db723F329e201ed9e497918DEFF895a88dB16');
    // getChainID();
    // venusContractMethods('0x0667eed0a0aab930af74a3dfedd263a73994f216');
}

function getContracts(filepath){
  const originSource = getABI(filepath);
  var bytecode = originSource.bytecode;
  var abi = originSource.abi;

  var myContract = new web3.eth.Contract(abi, '0x49C8dE2a75A8c56EbEDccFA952Fa0a33930e27eB', {
    from: '0xB970a169782e820ddD14Bf4fb44e0bEDc4775156', // default from address
    gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
  });

  myContract.methods.sendCoin('0xB2107e6F428Fa0Fb091dB4C7805D4048A9B5e11D', 10);
}

function metaContract2(filepath) {
  const from = '0xB970a169782e820ddD14Bf4fb44e0bEDc4775156';
  const to = '0xB2107e6F428Fa0Fb091dB4C7805D4048A9B5e11D';
  const amount = 1;

    const originSource = getABI(filepath);
    var bytecode = originSource.bytecode;
    var abi = originSource.abi;

    console.log("=====================");
    // console.log(bytecode);
    console.log(abi);
    console.log("=====================");

    const MyContract = new web3.eth.Contract(abi);

    let data = MyContract.deploy({
      receiver: to,
      amount: amount,
    }).encodeABI();

    //deploy
    web3.eth.getTransactionCount(from, (err, txCount) => {
        const txObject = {
            nonce: web3.utils.toHex(txCount),
            gasLimit: web3.utils.toHex(6700000), // Raise the gas limit to a much higher amount
            gasPrice: web3.utils.toHex(web3.utils.toWei("10", "gwei")),
            data: data,
        };

        const tx = new Tx(txObject);
        tx.sign(privateKey);

        const serializedTx = tx.serialize();
        const raw = "0x" + serializedTx.toString("hex");

        web3.eth
            .sendSignedTransaction(raw)
            .once("transactionHash", (hash) => {
                console.info(
                    "transactionHash",
                    "https://ropsten.etherscan.io/tx/" + hash
                );
            })
            .once("receipt", (receipt) => {
                console.info("receipt", receipt);
            })
            .on("error", console.error);
    });
}

function metaContract(filepath, contractAddress){
  const originSource = getABI(filepath);
  const myContract = new web3.eth.Contract(originSource.abi, contractAddress);

  const from = '0xB970a169782e820ddD14Bf4fb44e0bEDc4775156';
  const to = '0xB2107e6F428Fa0Fb091dB4C7805D4048A9B5e11D';
  const amount = 10;

  myContract.methods
      .sendCoin(to, amount)
      .send({from:from})
      .then((result) => {
          console.log(`Contract Result:${result}`);

          myContract.methods
            .getBalanceInEth(from)
            .call()
            .then((result) => {
                console.log(`From Address Balance:${result}`);
            });

          myContract.methods
            .getBalanceInEth(to)
            .call()
            .then((result) => {
                console.log(`To Address Balance:${result}`);
            });

          myContract.methods
            .getBalance(from)
            .call()
            .then((result) => {
                console.log(`From Address Balance:${result}`);
            });

          myContract.methods
            .getBalance(to)
            .call()
            .then((result) => {
                console.log(`To Address Balance:${result}`);
            });
      });
}

function convertLibContract(filepath, contractAddress, amount, rate) {
  const originSource = getABI(filepath);
  const myContract = new web3.eth.Contract(originSource.abi, contractAddress);

  myContract.methods
      .convert(amount, rate)
      .call()
      .then((result) => {
          console.log(`Contract Result:${result}`);
      });

  myContract.methods
      .convert2(amount, rate)
      .call()
      .then((result) => {
          console.log(`Contract Result:${result}`);
      });

  myContract.methods
      .convert3(amount, rate)
      .call()
      .then((result) => {
          console.log(`Contract Result:${result}`);
      });
}

function venusContractMethods(contractAddress){

}

function getABI(path) {
    var contractText = fs.readFileSync(path, "utf8");
    return JSON.parse(contractText);
}

function deploy(filepath) {
    const originSource = getABI(filepath);
    var bytecode = originSource.bytecode;
    var abi = originSource.abi;

    console.log("=====================");
    console.log(bytecode);
    console.log(abi);
    console.log("=====================");

    const MyContract = new web3.eth.Contract(abi);

    let deploy = MyContract.deploy({
        data: bytecode,
        from: sendAccount,
    }).encodeABI();

    //deploy
    web3.eth.getTransactionCount(sendAccount, (err, txCount) => {
        const txObject = {
            nonce: web3.utils.toHex(txCount),
            gasLimit: web3.utils.toHex(6700000), // Raise the gas limit to a much higher amount
            gasPrice: web3.utils.toHex(web3.utils.toWei("10", "gwei")),
            data: deploy,
        };

        const tx = new Tx(txObject);
        tx.sign(privateKey);

        const serializedTx = tx.serialize();
        const raw = "0x" + serializedTx.toString("hex");

        web3.eth
            .sendSignedTransaction(raw)
            .once("transactionHash", (hash) => {
                console.info(
                    "transactionHash",
                    "https://ropsten.etherscan.io/tx/" + hash
                );
            })
            .once("receipt", (receipt) => {
                console.info("receipt", receipt);
            })
            .on("error", console.error);
    });
}

function doContract(filepath, contractAddress) {
    const originSource = getABI(filepath);
    const myContract = new web3.eth.Contract(originSource.abi, contractAddress);

    // myContract.methods
    //     .convert(4, 5)
    //     .call()
    //     .then((result) => {4
    //         console.log(`Contract Result:${result}`);
    //     });

    myContract.methods
        .balanceOf(sendAccount)
        .call()
        .then((result) => {
            console.log(`Contract Result:${result}`);
        });
}

function allProcess() {
    //File Read
    // var source = fs.readFileSync("./contracts/ConvertLib.sol", "utf8");

    // console.log("transaction...compiling contract .....");
    // let compiledContract = solc.compile(source);
    // console.log("done!!" + compiledContract);

    // var bytecode = "";
    // var abi = "";
    // for (let contractName in compiledContract.contracts) {
    //     // code and ABI that are needed by web3
    //     abi = JSON.parse(compiledContract.contracts[contractName].interface);
    //     bytecode = compiledContract.contracts[contractName].bytecode; //컨트랙트 생성시 바이트코드로 등록
    //     // contjson파일을 저장
    // }

    var contractText = fs.readFileSync(
        "./build/contracts/ConvertLib.json",
        "utf8"
    );

    var abi = JSON.parse(contractText);
    console.log(abi);

    const MyContract = new web3.eth.Contract(abi.abi);

    let deploy = MyContract.deploy({
        data: bytecode,
        from: send_account,
    }).encodeABI();
    
    //deploy
    web3.eth.getTransactionCount(send_account, (err, txCount) => {
        const txObject = {
            nonce: web3.utils.toHex(txCount),
            gasLimit: web3.utils.toHex(1000000), // Raise the gas limit to a much higher amount
            gasPrice: web3.utils.toHex(web3.utils.toWei("10", "gwei")),
            data: "0x" + deploy,
        };

        const tx = new Tx(txObject);
        tx.sign(privateKey);

        const serializedTx = tx.serialize();
        const raw = "0x" + serializedTx.toString("hex");

        web3.eth
            .sendSignedTransaction(raw)
            .once("transactionHash", (hash) => {
                console.info(
                    "transactionHash",
                    "https://ropsten.etherscan.io/tx/" + hash
                );
            })
            .once("receipt", (receipt) => {
                console.info("receipt", receipt);
            })
            .on("error", console.error);
    });
}

function sendETH() {
    web3.eth.getTransactionCount(sendAccount, (err, txCount) => {
        const txObject = {
            nonce: web3.utils.toHex(txCount),
            gasLimit: web3.utils.toHex(100000),
            gasPrice: web3.utils.toHex(web3.utils.toWei("10", "gwei")),
            to: receiveAccount,
            value: "0x2386f26fc10000",
        };

        // const tx = new Tx(txObject);
        const tx = new Tx(txObject, { chain: "kovan", hardfork: "petersburg" });
        tx.sign(privateKey);

        const serializedTx = tx.serialize();
        const raw = "0x" + serializedTx.toString("hex");

        web3.eth
            .sendSignedTransaction(raw)
            .once("transactionHash", (hash) => {
                console.log(
                    "transactionHash",
                    "https://kovan.etherscan.io/tx/"
                );
            })
            .once("receipt", (receipt) => {
                console.log("receipt", receipt);
            })
            .on("error", (err) => {
                console.log(err);
            });
    });
}

function getAccounts() {
    web3.eth.getAccounts().then(console.log);
}

function getBalance(account) {
    web3.eth.getBalance(account).then(account => {
        console.log(`Balance:${account}, Converted Balance:${parseInt(account, 10) / (10 ** 18)}`);
    } );
}

function getChainID() {
    web3.eth.getChainId().then(console.log);
}

function sign(dataToSign, address){
    web3.eth.sign(dataToSign, address)
}

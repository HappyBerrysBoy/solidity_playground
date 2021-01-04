var solc = require("solc"); //contract Compile
var fs = require("fs"); //file 시스템
const Tx = require("ethereumjs-tx").Transaction;
const Web3 = require("web3");
// const web3 = new Web3(
//     new Web3.providers.HttpProvider(
//         "https://kovan.infura.io/v3/f4c65e7a8dac44a581100fe538f995cc"
//     )
// );
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
// const web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed1.binance.org:443"));

const sendAccount = "0xc33baF40aa7A55a352e3F6ca7C2546A602C4Ad2C";
const receiveAccount = "0x4f96604de8C61B549562eF48450Dbe2004A31dc3";
const privateKey = Buffer.from(
    "5429615a1d5076cff8aa207ab6348bf6c1ccec1c58dacc2bfc75ac7a03db1435",
    "hex"
);





  test();





function test() {
    metacoinContract(
        "./build/contracts/ConvertLib.json",
        "0x5c574fa7C1e4CC9A124eE9edA57E7CeE5C12eb18"
    ); // OKay 정상작동!!
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

function metacoinContract(contractAddress, method){
  const originSource = getABI(filepath);
  const myContract = new web3.eth.Contract(originSource.abi, contractAddress);

  myContract.methods
      .balanceOf(sendAccount)
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

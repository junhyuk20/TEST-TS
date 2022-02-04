import * as CryptoJS from "crypto-js";

//✨이 코드는 typeScript를 경함하기 위해 nomadecoders사이트의 니콜라스님의 영상을보고 작성 하였습니다.  

class Block {
    //✨ static으로 지정되지 않은 메서드는 무존건 Block객체를 new 사용해서 생성후 메서드에 도달할 수 있지만 static method는 new를 통해 Block 객체를 생성할 필요없이 Block.메서드명으로 바로 사용할 수 있다.✨
    //✨ calculate(=들어온 아규먼트를 통해서 BlockHash코드 값을 만드는 메서드 )
    public index: number;    
    public hash: string;
    public previousHash: string;
    public data: string;
    public timestamp: number;

    static calculateBlockHash = (
        index: number,
        previousHash: string,
        timestamp: number,
        data: string
    ): string => CryptoJS.SHA256(index + previousHash + timestamp + data).toString();  

    //✨새로만든 Blcok형태가 올바른지 확인하는 메서드 
    static validateStructure = (aBlock: Block): boolean => 
        typeof aBlock.index === 'number' &&
        typeof aBlock.hash === 'string' &&
        typeof aBlock.previousHash === 'string' &&
        typeof aBlock.timestamp === 'number' &&
        typeof aBlock.data === 'string';

    

    constructor(
        index: number,
        hash: string,   // hash 값이 들어갈 변수
        previousHash: string, // 이전 hash값  
        data: string,
        timestamp: number
    ) {
        this.index = index;
        this.hash = hash;
        this.previousHash = previousHash;
        this.data = data;
        this.timestamp = timestamp;
    }

}


const genesisBlock: Block = new Block(0,"2022","","Hello",20220204);

let blockChain: Block[] = [genesisBlock] ;  

const getBlockChain = (): Block[] => blockChain; // getBlockChain 함수 의 RETURN 값 형태가  Block[](=객체 배열형태로 반환) 인데 결과적으로 반환하는게 blockChain? 이라고 ?? 

//✨마지막으로 만든 Block 가져오기 
const getLastestBlock = (): Block => blockChain[blockChain.length-1];  

const getNewTimeStamp = (): number => Math.round(new Date().getTime() / 1000); // 현재시간을 가져와서 1000으로 나눈후 소수점은 모두 버림한 값

const createNewBlock = (data: string): Block => {
    //✨기존 Block중 제일 마지막에 작성된 놈 가져오기 
    const previousBlcok: Block = getLastestBlock();  
    
    //✨ 새롭게 만드는 녀석은 인덱스 +1 해주기
    const newIndex: number = previousBlcok.index + 1; // 위에서 말한데로 block객체 타입의 정보를 가지고 있으니 먼저 만든 놈이 있다면 그놈 보다 순서를 1더 올려서 만들겠다.
   
    //✨현재시간
    const newTimeStamp: number = getNewTimeStamp() ; // 이건뭐 계속 현재 시간으로 따지니 만들때 마다 다르다 
   
    //✨ 새로운 해쉬코드 만들기
    const newHash: string = Block.calculateBlockHash(  
        newIndex,
        previousBlcok.hash,
        newTimeStamp,
        data
    );
   
    //✨새로운 Block 만들기(=위에 있는 정보를 토대로) 
    const newBlock: Block = new Block(
        newIndex,
        newHash,
        previousBlcok.hash,
        data,
        newTimeStamp
    );
    addBlock(newBlock);
    return newBlock;
};

//✨BlockHash 코드값을 만들자!!
const getHashforBlock = (aBlock: Block): string => 
    Block.calculateBlockHash(
        aBlock.index,
        aBlock.previousHash,
        aBlock.timestamp,
        aBlock.data
    ); 

//✨새롭게 만드려고 하는 Block이 Block틀에 잘 맞춰 지는지 확인하는 함수
const isBlockValid = (candidateBlock: Block, previousBlock: Block): boolean => {
    if(!Block.validateStructure(candidateBlock)) { 
        //console.log(`구조가 않맞네?`)
        return false;
    } else if (previousBlock.index + 1 !== candidateBlock.index) { // 만들어진 번호가 제대로 됬는지 확인 (=기존 블럭 인덱스번호 +1을 하면 현재 새롭게 만드려고하는 블럭의 인덱스가 된다)
        //console.log(`인덱스 번호가 안맞는데?`)
        return false;
    } else if (previousBlock.hash !== candidateBlock.previousHash) { //현재 새롭게 만드려고하는 Block은 기존 Block의 hash코드를 가지고 있음 이걸 통해서 기존의 hash 랑 현재 만든 Block이 가진 previousHash코드가 같은지 판별
        //console.log(`기존 Block의 hash코드가 안맞아`)
        return false;
    } else if (getHashforBlock(candidateBlock) !== candidateBlock.hash) { //현재 똑같은 놈인데 똑같은 정보로 hash코드를 만드는데 그 코드가 다르면 말이 안된다는 거임
        //console.log(`만드려고하는 Block의 hash코드가 서로 다른데?`)
        return false;
    } else {
        return true;
    } 
};

const addBlock = (candidateBlock: Block): void => {
    if (isBlockValid(candidateBlock, getLastestBlock())) {
        blockChain.push(candidateBlock);
    }
}

createNewBlock("second block");
createNewBlock("third block");
createNewBlock("fourth block");

console.log(blockChain);

export {};
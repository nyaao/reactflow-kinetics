import _ from 'lodash';

function isEqualObjectArrays(arr1:any, arr2:any) {
    if (arr1.length !== arr2.length) {
        return false;
    }
    
    return arr1.every((obj:any, index:number) => _.isEqual(obj, arr2[index]));
}

export default isEqualObjectArrays;
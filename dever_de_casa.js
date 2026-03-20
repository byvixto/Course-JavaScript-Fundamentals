//const numeros = [2,7,11,15]
//const target = 9
function twoSum(nums, target) {
    let soma = 0;
    for (let index = 0; index < nums.length; index++) {
        const element = nums[index];
        //const numeros = [2,7,11,15]
        for (let j = index + 1; j < nums.length; j++) {
           debugger;
            soma = nums[index] + nums[j];
            if (soma == target) {
                return [nums[index], nums[j]]
            }
        }
    }
} 
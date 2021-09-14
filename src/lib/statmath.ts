
//recursive factorial function
function fact(n : number) : number {
	if (n == 1 || n == 0) {
		return 1;
	} else {
		//floor is so we don't infinite loop by accident
		return n * fact(Math.floor(n - (n > 0 ? 1 : -1)));
	}
}


//calculates nCk (n choose k) using recursive factorials
//u know, it probably makes more sense to calculate this recursively using nCk = (n-1)Ck + (n-1)C(k-1)
//OK, I don't actually think it makes sense to calculate that recursively and here's why:
//runtime of fact(n) is O(n) (loops once for each value from 1 to n)
// therefore runtime of binomcoeff(n,k) is O(n + k + (n-k)) = O(2n) = O(n)
//and I don't think binomcoeff beats O(n) because it has to recur at least n times and each time
//also recurs a factor of k times. but it's probably better if k is sufficiently small.
function binomcoeff(n : number, k : number) : number {
	if (n < k) return NaN;
	if (k == 1) return n; //save some time here, this is gonna be a common case
	if (k == 0) return 1; //this and above are not needed to run
	return fact(n) / (fact(k) * fact(n-k)); 
}

//probability density function for binomial distribution B(n,p) with k successes
function binompdf(n : number, p : number, k : number) : number {
	return binomcoeff(n, k) * Math.pow(p, k) * Math.pow(1-p, n-k);
}

export {binompdf};
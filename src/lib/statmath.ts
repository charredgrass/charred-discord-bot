
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
function binomcoeff(n : number, k : number) : number {
	if (n < k) return NaN;
	return fact(n) / (fact(k) * fact(n-k)); 
}
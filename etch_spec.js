describe("String Words to Span", function () {
	var test_str = "This is a string I typed";
	it("should put every word in a string into a span", function() {
		var expected_result = "<span>This</span> <span>is</span> <span>a</span> <span>string</span> <span>I</span> <span>typed</span>";
		expect(putWordsIntoSpans(test_str)).toBe(expected_result);
	});
	it("should not accept anything other than a string for transforming", function() {
		var wrong_input = function() {};
		var expected_exception = new Error("Invalid input");
		expect(function() {
			putWordsIntoSpans(wrong_input);
		}).toThrow(expected_exception);
	});
	it("should add a class to each span, if passed one", function() {
		var span_class = "myClass";
		var expected_result = "<span class='myClass'>This</span> <span class='myClass'>is</span> <span class='myClass'>a</span> <span class='myClass'>string</span> <span class='myClass'>I</span> <span class='myClass'>typed</span>";
		expect(putWordsIntoSpans(test_str, span_class)).toBe(expected_result);
	});
	it("should only accept a string class", function() {
		var span_class = {};
		var expected_result = "<span>This</span> <span>is</span> <span>a</span> <span>string</span> <span>I</span> <span>typed</span>";
		expect(function() {
			putWordsIntoSpans(test_str, span_class);
		}).toThrow(new Error("Invalid class"));
	});
});
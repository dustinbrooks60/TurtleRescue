TestCase("shuffle testSuite", {
    "test shuffle integers random": function(){
        let arrayTest = [2, 4 ,6, 8];
        assertNotEquals(arrayTest, shuffle(arrayTest));
    },
    "test empty array shuffle": function(){
        let arrayTest = [];
        let expected = undefined;
        assertEquals(expected, shuffle(arrayTest));
    },
    "test array of strings": function(){
        let arrayTest = ['a','b','c','d'];
        let notExpected = ['a','b','c','d'];
        assertNotEquals(notExpected, shuffle(arrayTest));
    },
    "test single element string": function(){
        let arrayTest = ['a'];
        let expected = ['a'];
        assertNotEquals(expected, shuffle(arrayTest));
    },
    "test single element integer": function(){
        let arrayTest = [1];
        let expected = [1];
        assertNotEquals(expected, shuffle(arrayTest));
    }
});

TestCase("getAnswer testSuite", {
    "test getAnswers": function(){
        let answerObject =
            {"2020": false,
            "2030": false,
            "2040": false,
            "2050": true};
        let answerArr = ["2020", "2030", "2040", "2050"];
        let expected = "2050";
        assertEquals(expected, getAnswer(answerObject, answerArr))
    },
    "test getAnswers example 2": function() {
        let answerObj = {
            "Drought": false,
            "Human activities": true,
            "Storms": false,
            "Volcanic eruptions": false
        };
        let answerArr = Object.keys(answerObj);
        let expected = "Human activities";
        assertEquals(expected, getAnswer(answerObj, answerArr))
    }
});

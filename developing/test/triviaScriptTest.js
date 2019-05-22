TestCase("shuffle testSuite", {
    "test empty array shuffle": function(){
        let arrayTest = [];
        let expected = [];
        assertEquals(expected, shuffle(arrayTest));
    },
    "test single element string": function(){
        let arrayTest = ['a'];
        let expected = ['a'];
        assertEquals(expected, shuffle(arrayTest));
    },
    "test single element integer": function(){
        let arrayTest = [1];
        let expected = [1];
        assertEquals(expected, shuffle(arrayTest));
    },
    "test type of element shuffled": function(){
        let arrayTest = ["1", "2", "3"];
        for (let i = 0; i < arrayTest.length; i++){
            assertEquals(typeof(arrayTest[i]), "string")
        }
    },
    "test type of object shuffled": function(){
        let arrayTest = ["1", "2", "3"];
        assertEquals(typeof(arrayTest), "object")
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
    },
    "test getAnswers typeof return value": function() {
        let answerObj = {
            "Drought": false,
            "Human activities": true,
            "Storms": false,
            "Volcanic eruptions": false
        };
        let answerArr = Object.keys(answerObj);
        let expected = "string";
        assertEquals(expected, typeof(getAnswer(answerObj, answerArr)))
    },
});

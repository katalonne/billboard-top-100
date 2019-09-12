/**
 * @jest-environment node
 */  
const getChart = require('../src/index')

describe('getChart', () => {
  beforeAll((done /* call it or remove it*/) => {
    done(); // calling it
  });
  
  test('Should get latest chart list', (done) => {
    getChart('hot-100',(err, charts) => {
      expect(err).toBeNull()
      expect(charts).toBeDefined()
      // songs exist
      expect(Array.isArray(charts.songs)).toBe(true)
      // 100 songs
      expect(charts.songs.length).toBe(100)
      // week exists
      expect(typeof charts.week).toBe('string')
      // previousWeek exists
      expect(charts.previousWeek).toBeDefined()
      // nextWeek  doesn't exists (this is the latest chart)
      expect(charts.nextWeek).toBeUndefined()
      done()
    })
  })

  test('Should get first week of June, 2019 chart list', (done) => {
    getChart('hot-100', '2019-06-01', (err, charts) => {
      expect(err).toBeNull()
      expect(charts).toBeDefined()
      // songs exist
      expect(Array.isArray(charts.songs)).toBe(true)
      // 100 songs
      expect(charts.songs.length).toBe(100)
      // week exists
      expect(typeof charts.week).toBe('string')
      // previousWeek exists
      expect(charts.previousWeek).toBeDefined()
      // nextWeek exists
      expect(charts.nextWeek).toBeDefined()
    })
    done()
  })

  test('Should throw error: invalid chart name', (done) => {
    getChart('fdfdf', (err, charts) => {
      expect(err).toBeDefined()
      done()
    })
  })
})




// test("adds 1 + 2 to equal 3", () => {
//   expect(1 + 2).toBe(3);
// });

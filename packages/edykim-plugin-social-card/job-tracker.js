exports.setupTracker = () => {
  let _reporter = null
  let _jobProgress = null
  let _total = 0
  let _done = 0

  const initProgress = ({ reporter }) => {
    _reporter = reporter
    _jobProgress = reporter.createProgress('generate social cards')
    _total = 0
    _done = 0
  }

  const jobStart = () => {
    if (_total === 0) {
      _jobProgress.start()
    }

    _total += 1
    _jobProgress.total = _total
  }

  const jobEnd = () => {
    _jobProgress.tick()
    _done += 1

    if (_done === _total) {
      _jobProgress.done()
      initProgress({ reporter: _reporter })
    }
  }

  return {
    initProgress,
    jobStart,
    jobEnd,
  }
}

# Filefast

A fork of 'ffmpeg-online' created by xiguaxigua

This version fixes the main issue I found with the original, which is that users can't batch process multiple sources at the same time very easily, only the last file the user inputted.

The original inspired me to build something I would want to use every day, with a more pleasing UI, and functionality that I'd use every day.

It supports:
- Dark mode
- Batch file processing
- Better output name management

The aim of Filefast is to get 'faster' files by means of smaller file size, quickly and easily.

### Current state:

This version is very limited, supporting conversion of images to jpegs with quality control. I'd like to implement:
- a more robust and tested system for other image formats
- Video compression
- Audio compression
- Automate codecs and quality control (currently only using the ffmpeg quality flag)

### Links
View the original repository here:
> https://github.com/xiguaxigua/ffmpeg-online


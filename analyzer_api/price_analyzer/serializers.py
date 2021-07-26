from rest_framework import serializers

class RequestSerializer(serializers.Serializer):
    gpu_name = serializers.CharField(max_length=100)